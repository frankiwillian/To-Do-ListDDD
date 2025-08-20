using System;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace TodoList.API.Configurations
{
    public static class AuthConfig
    {
        public static IServiceCollection AddAuthConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            // JWT Configuration
            var jwtSection = configuration.GetSection("JwtConfig");
            services.Configure<JwtConfig>(jwtSection);

            var jwtConfig = jwtSection.Get<JwtConfig>();
            var key = Encoding.ASCII.GetBytes(jwtConfig.Secret);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = jwtConfig.Issuer,
                    ValidAudience = jwtConfig.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            return services;
        }
    }
}