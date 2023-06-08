using System.Text;
using API.Constants;
using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extension;

public static class IdentityServiceExtension
{
    public static IServiceCollection AddIdentityServices(
        this IServiceCollection service,
        IConfiguration configuration
    )
    {
        service
            .AddIdentityCore<User>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;
                opt.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<DataContext>();

        service
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(Auth.TokenKey)
                    ),
                    ValidateAudience = false,
                    ValidateIssuer = false
                };
            });

        service.AddAuthorization(opt =>
        {
            opt.AddPolicy(
                Policy.IsActivityHost,
                policy =>
                {
                    policy.Requirements.Add(new IsHostRequirement());
                }
            );
        });

        service.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
        service.AddScoped<JwtTokenService>();

        return service;
    }
}
