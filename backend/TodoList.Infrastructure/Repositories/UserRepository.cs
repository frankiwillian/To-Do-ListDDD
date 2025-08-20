using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using TodoList.Domain.Entities;
using TodoList.Domain.Interfaces;
using TodoList.Infrastructure.Data;

namespace TodoList.Infrastructure.Repositories
{
    /// <summary>
    /// Implementação do repositório de usuários
    /// </summary>
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _dbSet.AnyAsync(u => u.Email == email);
        }
    }
}