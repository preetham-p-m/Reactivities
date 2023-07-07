using Microsoft.EntityFrameworkCore;
using Persistence;
using Persistence.Seed;
using API.Extension;
using API.Middleware;
using Microsoft.AspNetCore.Identity;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using API.SignalR;
using API.Constants;

namespace API;

public class Program
{
    private static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers(opt =>
        {
            // Authorize all controllers
            var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
            opt.Filters.Add(new AuthorizeFilter(policy));
        });
        builder.Services.AddApplicationServices(builder.Configuration, builder.Logging);
        builder.Services.AddIdentityServices();
        builder.Services.AddSwaggerService();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        app.UseMiddleware<ExceptionMiddleware>();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("CorsPolicy");

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.UseEndpoints(endpoint =>
        {
            endpoint.MapHub<ChatHub>(Message.PathChat);
        });
        // app.MapHub<ChatHub>(Message.PathChat);

        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;

        try
        {
            var userManager = services.GetRequiredService<UserManager<User>>();
            var context = services.GetRequiredService<DataContext>();
            await context.Database.MigrateAsync();
            await Seeder.SeedData(context, userManager);
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError("Error occured during migration!!!\n", ex);
            throw;
        }

        app.Run();
    }
}
