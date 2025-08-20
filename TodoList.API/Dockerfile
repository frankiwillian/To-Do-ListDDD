FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["TodoList.API/TodoList.API.csproj", "TodoList.API/"]
COPY ["TodoList.Application/TodoList.Application.csproj", "TodoList.Application/"]
COPY ["TodoList.Domain/TodoList.Domain.csproj", "TodoList.Domain/"]
COPY ["TodoList.Infrastructure/TodoList.Infrastructure.csproj", "TodoList.Infrastructure/"]
RUN dotnet restore "TodoList.API/TodoList.API.csproj"
COPY . .
WORKDIR "/src/TodoList.API"
RUN dotnet build "TodoList.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TodoList.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TodoList.API.dll"]