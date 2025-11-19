using CliniData.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CliniData.Infra.Persistence.Configurations
{
    public class MedicoInstituicaoConfiguration : IEntityTypeConfiguration<Medico>
    {
        public void Configure(EntityTypeBuilder<Medico> builder)
        {
            builder
                .HasMany(m => m.Instituicoes)
                .WithMany(i => i.Medicos)
                .UsingEntity<Dictionary<string, object>>(
                    "medico_instituicao",
                    j => j
                        .HasOne<Instituicao>()
                        .WithMany()
                        .HasForeignKey("instituicaoid")
                        .HasConstraintName("fk_medico_instituicao_instituicao")
                        .OnDelete(DeleteBehavior.Cascade),
                    j => j
                        .HasOne<Medico>()
                        .WithMany()
                        .HasForeignKey("medicoid")
                        .HasConstraintName("fk_medico_instituicao_medico")
                        .OnDelete(DeleteBehavior.Cascade)
                );
        }
    }
}
