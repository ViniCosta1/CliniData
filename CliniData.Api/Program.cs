using CliniData.Api.Repositories;
using CliniData.Api.Services;
using CliniData.Infra.Identity;
using CliniData.Infra.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------
// 🔹 CONFIGURAÇÃO DE CONNECTION STRING E DB CONTEXT
// --------------------------------------------------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' não encontrada.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(15), null);
    }));

// --------------------------------------------------
// 🔹 CONFIGURAÇÃO DE IDENTITY
// --------------------------------------------------
builder.Services
    .AddIdentityCore<ApplicationUser>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager<SignInManager<ApplicationUser>>()
    .AddDefaultTokenProviders();

builder.Services.AddSingleton<IEmailSender<ApplicationUser>, NoOpEmailSender>();

// --------------------------------------------------
// 🔹 CONFIGURAÇÃO DO JWT
// --------------------------------------------------
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key não encontrada no appsettings.json");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "CliniDataAPI";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// --------------------------------------------------
// 🔹 AUTORIZAÇÃO E CORS
// --------------------------------------------------
builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// --------------------------------------------------
// 🔹 DEPENDENCY INJECTION DE REPOSITORIES E SERVICES
// --------------------------------------------------
builder.Services.AddScoped<IPacienteRepository, PacienteRepository>();
builder.Services.AddScoped<IPacienteService, PacienteService>();

builder.Services.AddScoped<IMedicoRepository, MedicoRepository>();
builder.Services.AddScoped<IMedicoService, MedicoService>();

builder.Services.AddScoped<IConsultaRepository, ConsultaRepository>();
builder.Services.AddScoped<IConsultaService, ConsultaService>();

builder.Services.AddScoped<IExameRepository, ExameRepository>();
builder.Services.AddScoped<IExameService, ExameService>();

builder.Services.AddScoped<IInstituicaoRepository, InstituicaoRepository>();
builder.Services.AddScoped<IInstituicaoService, InstituicaoService>();

builder.Services.AddScoped<IHistoricoMedicoRepository, HistoricoMedicoRepository>();
builder.Services.AddScoped<IHistoricoMedicoService, HistoricoMedicoService>();

builder.Services.AddScoped<AuthService>();

// --------------------------------------------------
// 🔹 CONTROLLERS E SWAGGER
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

    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
        c.IncludeXmlComments(xmlPath);
});

// --------------------------------------------------
// 🔹 PIPELINE
// --------------------------------------------------
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CliniData API v1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapIdentityApi<ApplicationUser>();

app.MapGet("/health", () => Results.Ok(new { Status = "Saudável", Timestamp = DateTime.UtcNow }));

app.Run();
