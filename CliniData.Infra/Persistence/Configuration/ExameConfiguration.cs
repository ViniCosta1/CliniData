using CliniData.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CliniData.Infra.Persistence.Configurations
{
    public class ExameConfiguration : IEntityTypeConfiguration<Exame>
    {
        public void Configure(EntityTypeBuilder<Exame> builder)
        {
            builder.ToTable("exame");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.TipoExame)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.Instituicao)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(e => e.Resultado)
                .HasMaxLength(500);

            builder.Property(e => e.Observacao)
                .HasMaxLength(500);

            builder.Property(e => e.DocumentoExame)
                .HasColumnType("bytea");

            builder.Property(e => e.DataHora)
                .IsRequired();
        }
    }
}
