using CliniData.Domain.Entities;
using CliniData.Infra.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CliniData.Infra.Persistence.Configurations
{
    public sealed class MedicoConfiguration : IEntityTypeConfiguration<Medico>
    {
        public void Configure(EntityTypeBuilder<Medico> builder)
        {
            builder.ToTable("medico");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id)
                   .HasColumnName("id_medico")
                   .ValueGeneratedOnAdd();

            builder.Property(m => m.Nome)
                   .HasMaxLength(100)
                   .IsRequired();

            builder.Property(m => m.Telefone)
                   .HasMaxLength(20)
                   .IsRequired();

            builder.Property(m => m.EspecialidadeMedicaId)
                   .HasColumnName("especialidade_id")
                   .IsRequired();

            // CRM
            builder.OwnsOne(m => m.CRM, crm =>
            {
                crm.Property(c => c.Valor)
                   .HasColumnName("crm")
                   .HasMaxLength(20)
                   .IsRequired();

                crm.WithOwner().HasForeignKey("id_medico"); // 👈 força usar a mesma PK
                crm.HasIndex(c => c.Valor)
                   .IsUnique()
                   .HasDatabaseName("ix_medico_crm");
            });

            // Email
            builder.OwnsOne(m => m.Email, email =>
            {
                email.Property(e => e.Valor)
                     .HasColumnName("email")
                     .HasMaxLength(100)
                     .IsRequired();

                email.WithOwner().HasForeignKey("id_medico"); // 👈 aqui é o conserto
            });

            builder.HasOne<ApplicationUser>()
                   .WithMany()
                   .HasForeignKey(m => m.UserId)
                   .HasConstraintName("fk_medico_user")
                   .OnDelete(DeleteBehavior.Cascade);

            builder.Property(m => m.CriadoEmUtc).IsRequired();
            builder.Property(m => m.AtualizadoEmUtc);
        }
    }
}
