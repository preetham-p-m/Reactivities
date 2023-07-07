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

        app.UseXContentTypeOptions();
        app.UseReferrerPolicy(opt => opt.NoReferrer());
        app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
        app.UseXfo(opt => opt.Deny());
        // app.UseCsp(
        //     opt =>
        //         opt
        //         .BlockAllMixedContent()
        //         .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com"))
        //             .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
        //             .FormActions(s => s.Self())
        //             .FrameAncestors(s => s.Self())
        //             .ImageSources(
        //                 s => s.Self().CustomSources("blob:", "https://res.cloudinary.com")
        //             )
        //             .ScriptSources(s => s.Self())
        // );

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.Use(
                async (context, next) =>
                {
                    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
                    await next.Invoke();
                }
            );
        }

        app.UseCors("CorsPolicy");

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseDefaultFiles();
        app.UseStaticFiles();

        app.MapControllers();
        app.UseEndpoints(endpoint =>
        {
            endpoint.MapHub<ChatHub>(Message.PathChat);
        });
        // app.MapHub<ChatHub>(Message.PathChat);

        app.MapFallbackToController("Index", "Fallback");

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
