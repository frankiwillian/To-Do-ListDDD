using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TodoList.Application.Services;
using TodoList.Domain.Interfaces;
using TodoList.Infrastructure.Data;
using TodoList.Infrastructure.Repositories;

namespace TodoList.API.Configurations
{
    public static class DependencyInjectionConfig
    {
        public static IServiceCollection AddDependencyInjectionConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            // DbContext
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            // Repositories
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ITaskRepository, TaskRepository>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            // Services
            services.AddScoped<UserService>();
            services.AddScoped<TaskService>();

            return services;
        }
    }
}