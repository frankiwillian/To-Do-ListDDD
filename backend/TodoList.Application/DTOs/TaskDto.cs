using System;

namespace TodoList.Application.DTOs
{
    /// <summary>
    /// DTO para transferência de dados de tarefa
    /// </summary>
    public class TaskDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public Guid UserId { get; set; }
        public bool IsOverdue { get; set; }
    }

    /// <summary>
    /// DTO para criação de tarefa
    /// </summary>
    public class CreateTaskDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? DueDate { get; set; }
    }

    /// <summary>
    /// DTO para atualização de tarefa
    /// </summary>
    public class UpdateTaskDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? DueDate { get; set; }
    }
}