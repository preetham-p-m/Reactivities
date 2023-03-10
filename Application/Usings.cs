global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Threading.Tasks;
global using Serilog;

public class Usings
{
    public static void Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            //.WriteTo.Console()
            .CreateLogger();
    }
}