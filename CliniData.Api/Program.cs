using Microsoft.EntityFrameworkCore;
using CliniData.Api.Data;
using CliniData.Api.Repositories;
using CliniData.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Configuração dos serviços
builder.Services.AddControllers();

// Lê a connection string (DefaultConnection) do appsettings
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' não encontrada.");

// Configuração do Entity Framework para Postgres (Npgsql)
builder.Services.AddDbContext<CliniDataDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        // configura retries (opcional)
        npgsqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(15), null);
    }));

// Registro dos repositórios e serviços (Dependency Injection)
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

// Configuração do Swagger para documentação da API
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
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// Configuração de CORS (para permitir acesso do frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configuração do pipeline de requisições
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CliniData API v1");
        c.RoutePrefix = string.Empty; // Swagger na raiz da aplicação
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

// Verificação de saúde da aplicação
app.MapGet("/health", () => Results.Ok(new { Status = "Saudável", Timestamp = DateTime.UtcNow }));

app.Run();