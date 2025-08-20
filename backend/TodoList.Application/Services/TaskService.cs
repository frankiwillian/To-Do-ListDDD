using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TodoList.Application.DTOs;
using TodoList.Domain.Interfaces;

namespace TodoList.Application.Services
{
    /// <summary>
    /// Serviço de aplicação para gerenciamento de tarefas
    /// </summary>
    public class TaskService
    {
        private readonly ITaskRepository _taskRepository;

        public TaskService(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        public async Task<TaskDto> GetByIdAsync(Guid id)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null)
                return null;

            return MapToDto(task);
        }

        public async Task<IEnumerable<TaskDto>> GetAllByUserIdAsync(Guid userId)
        {
            var tasks = await _taskRepository.GetByUserIdAsync(userId);
            var taskDtos = new List<TaskDto>();

            foreach (var task in tasks)
            {
                taskDtos.Add(MapToDto(task));
            }

            return taskDtos;
        }

        public async Task<IEnumerable<TaskDto>> GetPendingByUserIdAsync(Guid userId)
        {
            var tasks = await _taskRepository.GetPendingTasksByUserIdAsync(userId);
            var taskDtos = new List<TaskDto>();

            foreach (var task in tasks)
            {
                taskDtos.Add(MapToDto(task));
            }

            return taskDtos;
        }

        public async Task<IEnumerable<TaskDto>> GetCompletedByUserIdAsync(Guid userId)
        {
            var tasks = await _taskRepository.GetCompletedTasksByUserIdAsync(userId);
            var taskDtos = new List<TaskDto>();

            foreach (var task in tasks)
            {
                taskDtos.Add(MapToDto(task));
            }

            return taskDtos;
        }

        public async Task<IEnumerable<TaskDto>> GetOverdueByUserIdAsync(Guid userId)
        {
            var tasks = await _taskRepository.GetOverdueTasksByUserIdAsync(userId);
            var taskDtos = new List<TaskDto>();

            foreach (var task in tasks)
            {
                taskDtos.Add(MapToDto(task));
            }

            return taskDtos;
        }

        public async Task<TaskDto> CreateAsync(CreateTaskDto createTaskDto, Guid userId)
        {
            var task = new Domain.Entities.Task(
                createTaskDto.Title,
                createTaskDto.Description,
                createTaskDto.DueDate,
                userId
            );

            await _taskRepository.AddAsync(task);
            await _taskRepository.SaveChangesAsync();

            return MapToDto(task);
        }

        public async Task<TaskDto> UpdateAsync(Guid id, UpdateTaskDto updateTaskDto, Guid userId)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null)
                throw new Exception("Tarefa não encontrada");

            if (task.UserId != userId)
                throw new Exception("Você não tem permissão para atualizar esta tarefa");

            task.UpdateTitle(updateTaskDto.Title);
            task.UpdateDescription(updateTaskDto.Description);
            task.UpdateDueDate(updateTaskDto.DueDate);

            await _taskRepository.UpdateAsync(task);
            await _taskRepository.SaveChangesAsync();

            return MapToDto(task);
        }

        public async Task MarkAsCompletedAsync(Guid id, Guid userId)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null)
                throw new Exception("Tarefa não encontrada");

            if (task.UserId != userId)
                throw new Exception("Você não tem permissão para atualizar esta tarefa");

            task.MarkAsCompleted();
            await _taskRepository.UpdateAsync(task);
            await _taskRepository.SaveChangesAsync();
        }

        public async Task MarkAsIncompleteAsync(Guid id, Guid userId)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null)
                throw new Exception("Tarefa não encontrada");

            if (task.UserId != userId)
                throw new Exception("Você não tem permissão para atualizar esta tarefa");

            task.MarkAsIncomplete();
            await _taskRepository.UpdateAsync(task);
            await _taskRepository.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id, Guid userId)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null)
                throw new Exception("Tarefa não encontrada");

            if (task.UserId != userId)
                throw new Exception("Você não tem permissão para excluir esta tarefa");

            await _taskRepository.DeleteAsync(task);
            await _taskRepository.SaveChangesAsync();
        }

        private TaskDto MapToDto(Domain.Entities.Task task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                CreatedAt = task.CreatedAt,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                UserId = task.UserId,
                IsOverdue = task.IsOverdue()
            };
        }
    }
}