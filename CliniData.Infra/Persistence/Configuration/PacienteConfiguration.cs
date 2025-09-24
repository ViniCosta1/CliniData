using CliniData.Domain.Entities;
using CliniData.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CliniData.Infra.Persistence.Configuration;

public sealed class PaicienteConfiguration : IEntityTypeConfiguration<Paciente>
{
    public void Configure(EntityTypeBuilder<Paciente> builder)
    {
        builder.ToTable("Paciente");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id).HasColumnName("IdPaciente").ValueGeneratedOnAdd();
        builder.Property(p => p.Nome).HasMaxLength(200).IsRequired();

        builder.Property(p => p.DataNascimento).IsRequired();

        builder.Property(p=>p.Sexo).HasConversion<string>().HasMaxLength(12).HasColumnName("Sexo").IsRequired();

        builder.Property(p => p.Telefone).HasMaxLength(30).IsRequired();
        
        builder.Property(p => p.CriadoEmUtc).IsRequired();

        builder.Property(p => p.AtualizadoEmUtc);

        builder.Property(p => p.NomeResponsavel).HasMaxLength(200);

        builder.OwnsOne(p => p.CPF, cpf =>
        {
            cpf.Property(x => x.Value).HasColumnName("CPF").HasMaxLength(11).IsRequired();
            cpf.HasIndex(x => x.Value).IsUnique().HasDatabaseName("IX_Paciente_CPF");
        }
        );

        builder.OwnsOne(p => p.Email, email =>
        {
            email.Property(x => x.Value).HasColumnName("Email").HasMaxLength(254).IsRequired();
        });

        builder.OwnsOne(p => p.Endereco, end =>
        {
            // Adapte os nomes conforme o seu VO. Ex.: Rua/Numero/Complemento/Bairro/Cidade/UF/CEP
            // Se o VO usa nomes em inglês, ajuste o HasColumnName.
            end.Property(x => x.Rua)
               .HasColumnName("Rua")
               .HasMaxLength(200)
               .IsRequired();

            end.Property(x => x.Numero)
               .HasColumnName("Numero")
               .HasMaxLength(20)
               .IsRequired();

            end.Property(x => x.Complemento)
               .HasColumnName("Complemento")
               .HasMaxLength(100);

            end.Property(x => x.Bairro)
               .HasColumnName("Bairro")
               .HasMaxLength(100)
               .IsRequired();

            end.Property(x => x.Cidade)
               .HasColumnName("Cidade")
               .HasMaxLength(100)
               .IsRequired();

            // UF como enum salvo como string "SP", "RJ", etc.
            end.Property(x => x.UF)
               .HasConversion(
                   v => v.ToString(),                // enum -> string
                   v => Enum.Parse<UF>(v))
               .HasColumnName("UF")
               .HasMaxLength(2)
               .IsRequired();

            end.Property(x => x.CEP)
               .HasColumnName("CEP")
               .HasMaxLength(8)
               .IsRequired();
        });

        builder.HasIndex(p => p.Nome).HasDatabaseName("IX_Paciente_Nome");
    
    }
}