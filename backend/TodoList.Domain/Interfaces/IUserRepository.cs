using System;
using System.Threading.Tasks;
using TodoList.Domain.Entities;

namespace TodoList.Domain.Interfaces
{
    /// <summary>
    /// Interface para o repositório de usuários
    /// </summary>
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
    }
}