using System;

namespace TodoList.Application.DTOs
{
    /// <summary>
    /// DTO para transferência de dados de usuário
    /// </summary>
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
        public bool Active { get; set; }
    }

    /// <summary>
    /// DTO para criação de usuário
    /// </summary>
    public class CreateUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    /// <summary>
    /// DTO para atualização de usuário
    /// </summary>
    public class UpdateUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }

    /// <summary>
    /// DTO para login de usuário
    /// </summary>
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    /// <summary>
    /// DTO para resposta de autenticação
    /// </summary>
    public class AuthResponseDto
    {
        public string Token { get; set; }
        public UserDto User { get; set; }
    }
}