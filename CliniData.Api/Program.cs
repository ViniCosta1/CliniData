using CliniData.Api.Repositories;
using CliniData.Api.Services;
using CliniData.Infra.Identity;
using CliniData.Infra.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ==============================
// 🔹 BANCO DE DADOS
// ==============================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// configurando email
// logo após configurar Identity:
builder.Services.Configure<SmtpOptions>(builder.Configuration.GetSection("Smtp"));
builder.Services.AddTransient<IEmailSender, EmailSender>();




// ==============================
// 🔹 IDENTITY
// ==============================
builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
    })
    .AddRoles<IdentityRole<int>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddApiEndpoints();

// ==============================
// 🔹 AUTENTICAÇÃO
//     Cookies → navegador / Swagger
//     JWT "Bearer" → mobile
// ==============================
var jwtKey = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]);

builder.Services.AddAuthentication(options =>
{
    // ⚠️ Nenhum esquema padrão → explicitamente escolher no [Authorize]
})
.AddCookie(IdentityConstants.ApplicationScheme)
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(jwtKey)
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var auth = context.Request.Headers["Authorization"].FirstOrDefault();
            if (!string.IsNullOrWhiteSpace(auth) && auth.StartsWith("Bearer "))
            {
                context.Token = auth.Substring("Bearer ".Length);
            }
            return Task.CompletedTask;
        }
    };
});

// ==============================
// 🔹 AUTORIZAÇÃO
// ==============================
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Paciente", policy =>
        policy.RequireRole("Paciente"));
    options.AddPolicy("Medico", policy =>
        policy.RequireRole("Medico"));
    options.AddPolicy("Instituicao", policy =>
        policy.RequireRole("Instituicao"));
    options.AddPolicy("Admin", policy =>
        policy.RequireRole("Admin"));
});






// ==============================
// 🔹 CORS
// ==============================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p => p
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});

// ==============================
// 🔹 DEPENDÊNCIAS
// ==============================
builder.Services.AddHttpContextAccessor();

// Repositórios e Services
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
builder.Services.AddScoped<IUsuarioAtualService, UsuarioAtualService>();
builder.Services.AddScoped<IMedicoInstituicaoService, MedicoInstituicaoService>();
builder.Services.AddScoped<IMedicoInstituicaoRepository, MedicoInstituicaoRepository>();

builder.Services.AddScoped<AuthService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ==============================
// 🔹 PIPELINE
// ==============================
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Endpoints do Identity (usando cookies)
app.MapIdentityApi<ApplicationUser>();

app.MapGet("/health", () => Results.Ok(new { status = "OK" }));

// ==============================
// 🔹 SEED DE ROLES
// ==============================

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();

    foreach (var role in new[] { "Admin", "Instituicao", "Medico", "Paciente" })
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole<int>(role));
}

app.Run();