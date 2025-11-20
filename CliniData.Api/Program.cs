using CliniData.Api.Services;
using CliniData.Infra.Persistence;
using CliniData.Infra.Identity;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.WebHost.UseUrls(
    "http://localhost:5274",
    "http://192.168.15.8:5274"
);

// --- Banco + Identity ---
builder.Services.AddDbContext<AppDbContext>();

builder.Services.AddIdentity<ApplicationUser, IdentityRole<int>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthorization();

builder.Services.AddScoped<AuthService>();

// --- Build ---
var app = builder.Build();

// --- Pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// --- ATIVA O CORS (antes dos controllers) ---
app.UseCors("AllowAll");

app.MapControllers();

app.MapGet("/health", () => Results.Ok(new { Status = "Saudavel", Timestamp = DateTime.UtcNow }));

app.Run();
