using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Application.Core.Exception;

namespace API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger,
        IHostEnvironment environment
    )
    {
        _environment = environment;
        _logger = logger;
        _next = next;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            _logger.LogError("Stack Trace: ", ex.StackTrace);

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = _environment.IsDevelopment()
                ? new AppException(
                    httpContext.Response.StatusCode,
                    _environment.IsDevelopment() + ex.Message,
                    ex.StackTrace?.ToString()
                )
                : new AppException(httpContext.Response.StatusCode, "Internal Server Error");

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var jsonResponse = JsonSerializer.Serialize(response, options);
            await httpContext.Response.WriteAsync(jsonResponse);
        }
    }
}
