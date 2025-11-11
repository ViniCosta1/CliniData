using CliniData.Domain.Entities;
using CliniData.Infra.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CliniData.Infra.Persistence.Configuration
{
    public sealed class PacienteConfiguration : IEntityTypeConfiguration<Paciente>
    {
        public void Configure(EntityTypeBuilder<Paciente> builder)
        {
            builder.ToTable("paciente");

            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id)
                   .HasColumnName("id_paciente")
                   .ValueGeneratedOnAdd();

            builder.Property(p => p.Nome)
                   .HasMaxLength(100)
                   .IsRequired();

            builder.Property(p => p.DataNascimento)
                   .HasColumnName("data_nascimento")
                   .IsRequired();

            builder.Property(p => p.Sexo)
                   .HasConversion<string>()
                   .HasColumnName("sexo")
                   .HasMaxLength(15)
                   .IsRequired();

            builder.Property(p => p.Telefone)
                   .HasMaxLength(20);

            // CPF
            builder.OwnsOne(p => p.CPF, cpf =>
            {
                cpf.Property(c => c.Valor)
                   .HasColumnName("cpf")
                   .HasMaxLength(14)
                   .IsRequired();

                cpf.WithOwner().HasForeignKey("id_paciente"); // 👈 força chave
                cpf.HasIndex(c => c.Valor)
                   .IsUnique()
                   .HasDatabaseName("ix_paciente_cpf");
            });

            // Email
            builder.OwnsOne(p => p.Email, email =>
            {
                email.Property(e => e.Valor)
                     .HasColumnName("email")
                     .HasMaxLength(100)
                     .IsRequired();

                email.WithOwner().HasForeignKey("id_paciente"); // 👈 idem
            });

            builder.HasOne(p => p.Endereco)
                   .WithOne(e => e.Paciente)
                   .HasForeignKey<Endereco>(e => e.PacienteId)
                   .OnDelete(DeleteBehavior.Cascade)
                   .HasConstraintName("fk_paciente_endereco");

            builder.HasOne<ApplicationUser>()
                   .WithMany()
                   .HasForeignKey(p => p.UserId)
                   .HasConstraintName("fk_paciente_user")
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
