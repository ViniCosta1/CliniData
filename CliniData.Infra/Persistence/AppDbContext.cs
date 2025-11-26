using CliniData.Domain.Entities;
using CliniData.Domain.ValueObjects;
using CliniData.Infra.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;


namespace CliniData.Infra.Persistence;

public class AppDbContext
    : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // DbSets opcionais (você pode usar só mapeamentos via configuration)
    /*    public DbSet<Paciente> Pacientes => Set<Paciente>();
        public DbSet<Medico> Medicos => Set<Medico>();
        public DbSet<EspecialidadeMedica> Especialidades => Set<EspecialidadeMedica>();*/
    public DbSet<Medico> Medico { get; set; }
    public DbSet<Paciente> Paciente { get; set; }
    public DbSet<Consulta> Consulta { get; set; }
    public DbSet<Exame> Exame { get; set; }
    public DbSet<HistoricoMedico> HistoricosMedico { get; set; }
    public DbSet<Instituicao> Instituicao { get; set; }
    public DbSet<EspecialidadeMedica> EspecialidadeMedica { get; set; }
    public DbSet<Endereco> Endereco { get; set; }
    public DbSet<MedicoInstituicao> MedicoInstituicao { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Converte DateTime para UTC
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTime, DateTime>(
                        v => v.Kind == DateTimeKind.Utc ? v : DateTime.SpecifyKind(v, DateTimeKind.Utc),
                        v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
                    ));
                }
            }
        }

        // Minúsculas para nomes de tabelas, colunas, chaves, etc.
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            entity.SetTableName(entity.GetTableName().ToLower());
            foreach (var property in entity.GetProperties()) property.SetColumnName(property.GetColumnName().ToLower());
            foreach (var key in entity.GetKeys()) key.SetName(key.GetName().ToLower());
            foreach (var foreignKey in entity.GetForeignKeys()) foreignKey.SetConstraintName(foreignKey.GetConstraintName().ToLower());
            foreach (var index in entity.GetIndexes()) index.SetDatabaseName(index.GetDatabaseName().ToLower());
        }

        // Aplica todas as configurations do Assembly
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Relações específicas
        modelBuilder.Entity<Medico>().HasOne<ApplicationUser>().WithMany().HasForeignKey(i => i.UserId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Medico>()
            .HasOne(m => m.EspecialidadeMedica)
            .WithMany()
            .HasForeignKey(m => m.EspecialidadeMedicaId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Paciente>()
           .HasOne(p => p.Endereco)
           .WithOne(e => e.Paciente)
           .HasForeignKey<Endereco>(e => e.PacienteId)
           .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Paciente>().HasOne<ApplicationUser>().WithMany().HasForeignKey(i => i.UserId).OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Endereco>(entity =>
        {
            entity.ToTable("endereco");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Rua).HasMaxLength(100);
            entity.Property(e => e.Numero).HasMaxLength(10);
            entity.Property(e => e.Complemento).HasMaxLength(30);
            entity.Property(e => e.Bairro).HasMaxLength(50);
            entity.Property(e => e.Cidade).HasMaxLength(50);
            entity.Property(e => e.UF).HasMaxLength(2);
            entity.Property(e => e.CEP).HasMaxLength(10);
        });
    }
    
}