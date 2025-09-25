using System.Reflection;
using CliniData.Domain.Entities;
using CliniData.Infra.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace CliniData.Infra.Persistence;

public class AppDbContext
    : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // DbSets opcionais (você pode usar só mapeamentos via configuration)
    public DbSet<Paciente> Pacientes => Set<Paciente>();
    public DbSet<Medico> Medicos => Set<Medico>();
    public DbSet<EspecialidadeMedica> Especialidades => Set<EspecialidadeMedica>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Aplica suas configurations do domínio (Paciente, Medico, etc.)
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Tabelas padrão do Identity já são criadas. Você pode customizar nomes se quiser.
        // Exemplo de customização:
        // modelBuilder.Entity<ApplicationUser>().ToTable("Usuarios");
        // modelBuilder.Entity<IdentityRole<int>>().ToTable("Perfis");
        // modelBuilder.Entity<IdentityUserRole<int>>().ToTable("UsuariosPerfis");
    }
}