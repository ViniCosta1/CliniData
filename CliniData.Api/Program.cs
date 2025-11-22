using CliniData.Api.Services;
using CliniData.Infra.Persistence;
<<<<<<< HEAD
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------
// 🔹 BANCO DE DADOS (PostgreSQL)
// --------------------------------------------------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' não encontrada.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(15), null);
    })
);

// --------------------------------------------------
// 🔹 IDENTITY + ROLES + EF CORE
// --------------------------------------------------
builder.Services
    .AddIdentity<ApplicationUser, IdentityRole<int>>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.Password.RequireDigit = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequiredLength = 6;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Email fake
builder.Services.AddSingleton<IEmailSender<ApplicationUser>, NoOpEmailSender>();


// --------------------------------------------------
// 🔹 AUTENTICAÇÃO COM IDENTITY BEARER TOKEN
// --------------------------------------------------
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = IdentityConstants.BearerScheme;
        options.DefaultChallengeScheme = IdentityConstants.BearerScheme;
    })
    .AddBearerToken(IdentityConstants.BearerScheme); // ESSENCIAL


// --------------------------------------------------
// 🔹 AUTORIZAÇÃO + CORS
// --------------------------------------------------
builder.Services.AddAuthorization();

=======
using CliniData.Infra.Identity;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

>>>>>>> 62bebe413d3486efe138443236ddbe963d5caeae
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

<<<<<<< HEAD
// --------------------------------------------------
// 🔹 DEPENDENCY INJECTION
// --------------------------------------------------
builder.Services.AddScoped<IPacienteRepository, PacienteRepository>();
builder.Services.AddScoped<IPacienteService, PacienteService>();
=======
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
>>>>>>> 62bebe413d3486efe138443236ddbe963d5caeae

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

<<<<<<< HEAD
// --------------------------------------------------
// 🔹 CONTROLLERS + SWAGGER
// --------------------------------------------------
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "CliniData API",
        Version = "v1",
        Description = "API para gerenciamento de pacientes do sistema CliniData"
    });

    // Comentários XML
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
        c.IncludeXmlComments(xmlPath);

    // JWT no Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "Token JWT (Identity API): Bearer {token}",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Id = "Bearer",
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme
                }
            },
            Array.Empty<string>()
        }
    });
});

// --------------------------------------------------
// 🔹 PIPELINE
// --------------------------------------------------
=======
// --- Build ---
>>>>>>> 62bebe413d3486efe138443236ddbe963d5caeae
var app = builder.Build();

// --- Pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// --- ATIVA O CORS (antes dos controllers) ---
app.UseCors("AllowAll");
<<<<<<< HEAD

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 🔥 Identity API (login, logout, refresh token)
app.MapIdentityApi<ApplicationUser>();

// Endpoint simples de teste
app.MapGet("/health", () =>
    Results.Ok(new
    {
        Status = "Saudável",
        Timestamp = DateTime.UtcNow
    })
);
=======

app.MapControllers();

app.MapGet("/health", () => Results.Ok(new { Status = "Saudavel", Timestamp = DateTime.UtcNow }));
>>>>>>> 62bebe413d3486efe138443236ddbe963d5caeae

app.Run();
