api:
	SET ASPNETCORE_ENVIRONMENT=Development
	dotnet run --project dotnet/API/API.csproj

api-pord:
	SET ASPNETCORE_ENVIRONMENT=Production
	dotnet run --project dotnet/API/API.csproj 

watch:
	SET ASPNETCORE_ENVIRONMENT=Development
	dotnet watch --no-hot-reload --project dotnet/API/API.csproj

watch-prod:
	SET ASPNETCORE_ENVIRONMENT=Production
	dotnet watch --no-hot-reload --project dotnet/API/API.csproj

build:
	dotnet build dotnet/Reactivities.sln

restore:
	dotnet restore dotnet/Reactivities.sln

clean:
	dotnet clean dotnet/Reactivities.sln

ui:
	npm --prefix ui start

ui-install:
	npm --prefix ui install --legacy-peer-deps