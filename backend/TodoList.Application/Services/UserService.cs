using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TodoList.Application.DTOs;
using TodoList.Domain.Entities;
using TodoList.Domain.Interfaces;

namespace TodoList.Application.Services
{
    /// <summary>
    /// Serviço de aplicação para gerenciamento de usuários
    /// </summary>
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public UserService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<UserDto> GetByIdAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return null;

            return MapToDto(user);
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await _userRepository.GetAllAsync();
            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                userDtos.Add(MapToDto(user));
            }

            return userDtos;
        }

        public async Task<AuthResponseDto> RegisterAsync(CreateUserDto createUserDto)
        {
            // Verificar se o email já existe
            if (await _userRepository.EmailExistsAsync(createUserDto.Email))
                throw new Exception("Email já está em uso");

            // Criar hash da senha
            string passwordHash = HashPassword(createUserDto.Password);

            // Criar novo usuário
            var user = new User(createUserDto.Name, createUserDto.Email, passwordHash);

            // Salvar usuário
            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            // Gerar token JWT
            var token = GenerateJwtToken(user);

            // Retornar resposta
            return new AuthResponseDto
            {
                Token = token,
                User = MapToDto(user)
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            // Buscar usuário pelo email
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);
            if (user == null)
                throw new Exception("Email ou senha inválidos");

            // Verificar senha
            if (!VerifyPassword(loginDto.Password, user.PasswordHash))
                throw new Exception("Email ou senha inválidos");

            // Verificar se usuário está ativo
            if (!user.Active)
                throw new Exception("Usuário desativado");

            // Registrar login
            user.RegisterLogin();
            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();

            // Gerar token JWT
            var token = GenerateJwtToken(user);

            // Retornar resposta
            return new AuthResponseDto
            {
                Token = token,
                User = MapToDto(user)
            };
        }

        public async Task<UserDto> UpdateAsync(Guid id, UpdateUserDto updateUserDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                throw new Exception("Usuário não encontrado");

            // Verificar se o email já existe (se foi alterado)
            if (updateUserDto.Email != user.Email && await _userRepository.EmailExistsAsync(updateUserDto.Email))
                throw new Exception("Email já está em uso");

            // Atualizar dados
            user.UpdateName(updateUserDto.Name);
            user.UpdateEmail(updateUserDto.Email);

            // Salvar alterações
            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();

            return MapToDto(user);
        }

        public async Task DeleteAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                throw new Exception("Usuário não encontrado");

            // Desativar usuário em vez de excluir fisicamente
            user.Deactivate();
            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();
        }

        private UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                LastLogin = user.LastLogin,
                Active = user.Active
            };
        }

        private string HashPassword(string password)
        {
            using (var hmac = new HMACSHA512())
            {
                var salt = hmac.Key;
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

                // Combinar salt e hash
                var hashBytes = new byte[salt.Length + hash.Length];
                Array.Copy(salt, 0, hashBytes, 0, salt.Length);
                Array.Copy(hash, 0, hashBytes, salt.Length, hash.Length);

                return Convert.ToBase64String(hashBytes);
            }
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var hashBytes = Convert.FromBase64String(storedHash);

            // Extrair salt (primeiros 128 bytes)
            var salt = new byte[128];
            Array.Copy(hashBytes, 0, salt, 0, salt.Length);

            // Calcular hash com o mesmo salt
            using (var hmac = new HMACSHA512(salt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

                // Verificar se os hashes são iguais
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != hashBytes[salt.Length + i])
                        return false;
                }
            }

            return true;
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}