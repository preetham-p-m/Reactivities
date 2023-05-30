using Application.Activities;
using Application.Core.Mapping;
using FluentValidation;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Serilog;

namespace API.Extension;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration,
        ILoggingBuilder loggingBuilder
    )
    {
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        // Database context
        services.AddDbContext<DataContext>(opt =>
        {
            // opt.UseSqlite(configuration.GetConnectionString("DefaultSqlLite"));
            opt.UseMySql(
                configuration.GetConnectionString("DefaultMySql"),
                new MySqlServerVersion(new Version())
            );
        });

        // Cors Policy
        services.AddCors(opt =>
        {
            opt.AddPolicy(
                "CorsPolicy",
                policy =>
                {
                    // white-listing UI application
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                }
            );
        });

        // Mediator service
        services.AddMediatR(typeof(List.Handler));

        // automapper service
        services.AddAutoMapper(typeof(ActivityProfiles).Assembly);

        // fluent validation service
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<Create>();

        // Added Serilog Configuration
        var logger = new LoggerConfiguration().ReadFrom
            .Configuration(configuration)
            .Enrich.FromLogContext()
            .CreateLogger();
        loggingBuilder.ClearProviders();
        loggingBuilder.AddSerilog(logger);

        return services;
    }
}
