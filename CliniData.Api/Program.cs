using CliniData.Api.Repositories;
using CliniData.Api.Services;
using CliniData.Infra.Identity;
using CliniData.Infra.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// =============================================
// 🔹 BANCO DE DADOS
// =============================================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// =============================================
// 🔹 AUTHENTICATION COOKIE (AGORA O LOGIN FUNCIONA)
// =============================================
builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.Password.RequireDigit = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequiredLength = 6;
    })
    .AddRoles<IdentityRole<int>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddApiEndpoints();

// 🔥 HABILITA AUTENTICAÇÃO POR COOKIE DO IDENTITY
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
    options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
    options.DefaultSignInScheme = IdentityConstants.ApplicationScheme;
})
.AddCookie(IdentityConstants.ApplicationScheme);

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Paciente", p => p.RequireRole("Paciente"));
    options.AddPolicy("Medico", p => p.RequireRole("Medico"));
    options.AddPolicy("Instituicao", p => p.RequireRole("Instituicao"));
});


// =============================================
// 🔹 EMAIL FAKE (OBRIGATÓRIO PARA MapIdentityApi)
// =============================================
builder.Services.AddSingleton<IEmailSender<ApplicationUser>, NoOpEmailSender>();

// =============================================
// 🔹 CORS
// =============================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// =============================================
// 🔹 DI
// =============================================
builder.Services.AddHttpContextAccessor();
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
builder.Services.AddScoped<UsuarioAtualService>();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =============================================
// 🔹 PIPELINE
// =============================================
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// 🔥 MUITO IMPORTANTE — DEPOIS DO CORS
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 🔥 Identity Endpoints (login, logout, register)
app.MapIdentityApi<ApplicationUser>();

// Healthcheck
app.MapGet("/health", () => Results.Ok(new { status = "OK" }));

// =============================================
// 🔹 SEED DE ROLES
// =============================================
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();

    string[] roles = { "Admin", "Instituicao", "Medico", "Paciente" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole<int>(role));
    }
}

app.Run();
