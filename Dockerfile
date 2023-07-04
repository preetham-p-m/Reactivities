FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app

# copy files 
COPY "dotnet/Reactivities.sln" "Reactivities.sln"
COPY "dotnet/API/API.csproj" "API/API.csproj"
COPY "dotnet/Application/Application.csproj" "Application/Application.csproj"
COPY "dotnet/Domain/Domain.csproj" "Domain/Domain.csproj"
COPY "dotnet/Persistence/Persistence.csproj" "Persistence/Persistence.csproj"
COPY "dotnet/Infrastructure/Infrastructure.csproj" "Infrastructure/Infrastructure.csproj"

# restoring all the packages
RUN dotnet restore "Reactivities.sln"

# copy everything else and build
COPY . .
WORKDIR /app
RUN dotnet publish -c Release -o out

# build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet", "API.dll" ]
