namespace API.BackgroundServices;

public class ActivityBackgroundService : BackgroundService
{
    private readonly ILogger<ActivityBackgroundService> _logger;

    public ActivityBackgroundService(ILogger<ActivityBackgroundService> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        double num = 0;
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation(
                "{dateTime}: Tesing Background Service: {num}",
                DateTime.Now,
                num
            );
            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            num += 1;
        }
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Tesing Background Service: Stopped");
        return Task.CompletedTask;
    }
}
