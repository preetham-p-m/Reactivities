using Application.Activities;
using Application.Core.Mapping;
using Application.Interface;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Media;
using Infrastructure.Security;
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
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        // database context
        services.AddDbContext<DataContext>(opt =>
        {
            // opt.UseSqlite(configuration.GetConnectionString("DefaultSqlLite"));
            opt.UseMySql(
                configuration.GetConnectionString("DefaultMySql"),
                new MySqlServerVersion(new Version())
            );
        });

        // cors Policy
        services.AddCors(opt =>
        {
            opt.AddPolicy(
                "CorsPolicy",
                policy =>
                {
                    // white-listing UI application
                    policy
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithOrigins("http://localhost:3000");
                }
            );
        });

        // mediator service
        services.AddMediatR(typeof(List.Handler));

        // automapper service
        services.AddAutoMapper(typeof(ActivityProfiles).Assembly);

        // fluent validation service
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<Create>();

        // serilog Configuration
        var logger = new LoggerConfiguration().ReadFrom
            .Configuration(configuration)
            .Enrich.FromLogContext()
            .CreateLogger();
        loggingBuilder.ClearProviders();
        loggingBuilder.AddSerilog(logger);

        // Adding DI service and enable use of AddHttpContextAccessor
        services.AddHttpContextAccessor();
        services.AddScoped<IUserAccessor, UserAccessor>();
        services.AddScoped<IMediaAccessor, MediaAccessor>();

        services.Configure<CloudinarySettings>(configuration.GetSection("Cloudinary"));

        services.AddSignalR();

        return services;
    }
}
