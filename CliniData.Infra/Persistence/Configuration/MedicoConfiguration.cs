using CliniData.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CliniData.Infra.Persistence.Configurations;

public sealed class MedicoConfiguration : IEntityTypeConfiguration<Medico>
{
    public void Configure(EntityTypeBuilder<Medico> builder)
    {
        builder.ToTable("Medico");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Id)
               .HasColumnName("IdMedico")
               .ValueGeneratedOnAdd();

        builder.Property(m => m.Nome)
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(m => m.CRM)
               .HasMaxLength(20)
               .IsRequired();

        builder.HasIndex(m => m.CRM)
               .IsUnique()
               .HasDatabaseName("UX_Medico_CRM");

        builder.Property(m => m.EspecialidadeId)
               .HasColumnName("EspecialidadeId")
               .IsRequired();

        builder.Property(m => m.Telefone)
               .HasMaxLength(20)
               .IsRequired();

        // Email como Value Object (Owned)
        builder.OwnsOne(m => m.Email, email =>
        {
            email.Property(x => x.Value)
                 .HasColumnName("Email")
                 .HasMaxLength(100) // conforme SQL
                 .IsRequired();

            // Índice de e-mail (opcional; geralmente não único globalmente para médicos)
            // email.HasIndex(x => x.Value).HasDatabaseName("IX_Medico_Email");
        });

        // Relacionamento com EspecialidadeMedica (FK EspecialidadeId)
        builder.HasOne(m => m.Especialidade)
               .WithMany()
               .HasForeignKey(m => m.EspecialidadeId)
               .OnDelete(DeleteBehavior.Restrict);

        // Timestamps (BaseEntity)
        builder.Property(m => m.CriadoEmUtc).IsRequired();
        builder.Property(m => m.AtualizadoEmUtc);
    }
}
