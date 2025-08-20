using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TodoList.Domain.Entities;

namespace TodoList.Domain.Interfaces
{
    /// <summary>
    /// Interface para o repositório de tarefas
    /// </summary>
    public interface ITaskRepository : IRepository<Task>
    {
        System.Threading.Tasks.Task<IEnumerable<Task>> GetByUserIdAsync(Guid userId);
        System.Threading.Tasks.Task<IEnumerable<Task>> GetPendingTasksByUserIdAsync(Guid userId);
        System.Threading.Tasks.Task<IEnumerable<Task>> GetCompletedTasksByUserIdAsync(Guid userId);
        System.Threading.Tasks.Task<IEnumerable<Task>> GetOverdueTasksByUserIdAsync(Guid userId);
    }
}