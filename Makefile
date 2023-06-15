api-run:
	set ASPNETCORE_ENVIRONMENT=Development
	dotnet run --project dotnet/API/API.csproj

api-pord:
	set ASPNETCORE_ENVIRONMENT=Production
	dotnet run --project dotnet/API/API.csproj 

api-watch:
	set ASPNETCORE_ENVIRONMENT=Development
	dotnet watch --no-hot-reload --project dotnet/API/API.csproj

api-watch-prod:
	set ASPNETCORE_ENVIRONMENT=Production
	dotnet watch --no-hot-reload --project dotnet/API/API.csproj

api-create-migration:
	dotnet ef migrations add <Migration-Message> -s dotnet/API -p dotnet/Persistence

api-build:
	dotnet build dotnet/Reactivities.sln

api-restore:
	dotnet restore dotnet/Reactivities.sln

api-clean:
	dotnet clean dotnet/Reactivities.sln

ui-start:
	npm --prefix ui run start

ui-install:
	npm --prefix ui install --legacy-peer-deps

# TODO: Add launch config