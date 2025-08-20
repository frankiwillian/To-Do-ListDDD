using Microsoft.EntityFrameworkCore;
using TodoList.Domain.Entities;

namespace TodoList.Infrastructure.Data
{
    /// <summary>
    /// Contexto do banco de dados da aplicação
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Domain.Entities.Task> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração da entidade User
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.Active).IsRequired();
            });

            // Configuração da entidade Task
            modelBuilder.Entity<Domain.Entities.Task>(entity =>
            {
                entity.ToTable("Tasks");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.IsCompleted).IsRequired();
                
                // Relacionamento com User
                entity.HasOne(e => e.User)
                      .WithMany(u => u.Tasks)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}