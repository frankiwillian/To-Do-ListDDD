using System;
using System.Collections.Generic;

namespace TodoList.Domain.Entities
{
    /// <summary>
    /// Entidade que representa um usuário no sistema
    /// </summary>
    public class User
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public string Email { get; private set; }
        public string PasswordHash { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? LastLogin { get; private set; }
        public bool Active { get; private set; }
        public virtual ICollection<Task> Tasks { get; private set; }

        // Construtor protegido para EF Core
        protected User() { }

        public User(string name, string email, string passwordHash)
        {
            Id = Guid.NewGuid();
            Name = name;
            Email = email;
            PasswordHash = passwordHash;
            CreatedAt = DateTime.Now;
            Active = true;
            Tasks = new List<Task>();
        }

        public void UpdateName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Nome não pode ser vazio");

            Name = name;
        }

        public void UpdateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email não pode ser vazio");

            Email = email;
        }

        public void UpdatePassword(string passwordHash)
        {
            if (string.IsNullOrWhiteSpace(passwordHash))
                throw new ArgumentException("Senha não pode ser vazia");

            PasswordHash = passwordHash;
        }

        public void Deactivate()
        {
            Active = false;
        }

        public void Activate()
        {
            Active = true;
        }

        public void RegisterLogin()
        {
            LastLogin = DateTime.Now;
        }
    }
}