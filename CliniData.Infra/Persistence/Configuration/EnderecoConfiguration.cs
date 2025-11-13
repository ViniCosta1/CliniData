using CliniData.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CliniData.Infra.Persistence.Configuration;

public sealed class EnderecoConfiguration : IEntityTypeConfiguration<Endereco>
{
    public void Configure(EntityTypeBuilder<Endereco> builder)
    {
        builder.ToTable("endereco");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
               .HasColumnName("id_endereco")
               .ValueGeneratedOnAdd();

        builder.Property(e => e.Rua)
               .HasColumnName("rua")
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(e => e.Numero)
               .HasColumnName("numero")
               .HasMaxLength(10)
               .IsRequired();

        builder.Property(e => e.Complemento)
               .HasColumnName("complemento")
               .HasMaxLength(30);

        builder.Property(e => e.Bairro)
               .HasColumnName("bairro")
               .HasMaxLength(50)
               .IsRequired();

        builder.Property(e => e.Cidade)
               .HasColumnName("cidade")
               .HasMaxLength(50)
               .IsRequired();

        builder.Property(e => e.UF)
               .HasColumnName("estado")
               .HasMaxLength(2)
               .IsRequired();

        builder.Property(e => e.CEP)
               .HasColumnName("cep")
               .HasMaxLength(10)
               .IsRequired();
    }
}
