using CliniData.Api.Services;
using CliniData.Infra.Persistence;
using CliniData.Infra.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- Serviços ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- Força a API a "Ouvir" no seu IP ---
builder.WebHost.UseUrls(
    "http://localhost:5274",
    "https://localhost:7172",
    "http://192.168.15.8:5274",
    "https://192.168.15.8:7172"
);

// --- Configuração do Banco e Identity ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddIdentity<ApplicationUser, IdentityRole<int>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthorization(options => { });

// --- Serviços "Assistentes" ---
builder.Services.AddScoped<AuthService>();

// --- Construção ---
var app = builder.Build();

// --- Pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

// HealthCheck
app.MapGet("/health", () => Results.Ok(new { Status = "Saudavel", Timestamp = DateTime.UtcNow }));

app.Run();
