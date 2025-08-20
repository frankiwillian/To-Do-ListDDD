using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoList.Domain.Interfaces;
using TodoList.Infrastructure.Data;

namespace TodoList.Infrastructure.Repositories
{
    /// <summary>
    /// Implementação do repositório de tarefas
    /// </summary>
    public class TaskRepository : Repository<Domain.Entities.Task>, ITaskRepository
    {
        public TaskRepository(AppDbContext context) : base(context)
        {
        }

        public async System.Threading.Tasks.Task<IEnumerable<Domain.Entities.Task>> GetByUserIdAsync(Guid userId)
        {
            return await _dbSet.Where(t => t.UserId == userId).ToListAsync();
        }

        public async System.Threading.Tasks.Task<IEnumerable<Domain.Entities.Task>> GetPendingTasksByUserIdAsync(Guid userId)
        {
            return await _dbSet.Where(t => t.UserId == userId && !t.IsCompleted).ToListAsync();
        }

        public async System.Threading.Tasks.Task<IEnumerable<Domain.Entities.Task>> GetCompletedTasksByUserIdAsync(Guid userId)
        {
            return await _dbSet.Where(t => t.UserId == userId && t.IsCompleted).ToListAsync();
        }

        public async System.Threading.Tasks.Task<IEnumerable<Domain.Entities.Task>> GetOverdueTasksByUserIdAsync(Guid userId)
        {
            var currentDate = DateTime.Now;
            return await _dbSet.Where(t => t.UserId == userId && !t.IsCompleted && t.DueDate.HasValue && t.DueDate < currentDate).ToListAsync();
        }
    }
}