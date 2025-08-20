using System;

namespace TodoList.Domain.Entities
{
    /// <summary>
    /// Entidade que representa uma tarefa no sistema
    /// </summary>
    public class Task
    {
        public Guid Id { get; private set; }
        public string Title { get; private set; }
        public string Description { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? DueDate { get; private set; }
        public bool IsCompleted { get; private set; }
        public Guid UserId { get; private set; }
        public virtual User User { get; private set; }

        // Construtor protegido para EF Core
        protected Task() { }

        public Task(string title, string description, DateTime? dueDate, Guid userId)
        {
            Id = Guid.NewGuid();
            Title = title;
            Description = description;
            CreatedAt = DateTime.Now;
            DueDate = dueDate;
            IsCompleted = false;
            UserId = userId;
        }

        public void UpdateTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Título não pode ser vazio");

            Title = title;
        }

        public void UpdateDescription(string description)
        {
            Description = description;
        }

        public void UpdateDueDate(DateTime? dueDate)
        {
            DueDate = dueDate;
        }

        public void MarkAsCompleted()
        {
            IsCompleted = true;
        }

        public void MarkAsIncomplete()
        {
            IsCompleted = false;
        }

        public bool IsOverdue()
        {
            return DueDate.HasValue && DueDate.Value < DateTime.Now && !IsCompleted;
        }
    }
}