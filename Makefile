run-api:
	ASPNETCORE_ENVIRONMENT=Development \
	dotnet run --project API/API.csproj

watch:
	ASPNETCORE_ENVIRONMENT=Development \
	dotnet watch --no-hot-reload --project API/API.csproj

build:
	dotnet build Reactivities.sln

restore:
	dotnet restore Reactivities.sln

clean:
	dotnet clean

run-ui:
	npm --prefix client-app start

ui-install:
	npm --prefix client-app install --legacy-peer-deps