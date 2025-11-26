using CliniData.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CliniData.Infra.Persistence.Configurations
{
    public class MedicoInstituicaoConfiguration : IEntityTypeConfiguration<MedicoInstituicao>
    {
        public void Configure(EntityTypeBuilder<MedicoInstituicao> builder)
        {
            builder.ToTable("medico_instituicao");

            // Chave composta
            builder.HasKey(mi => new { mi.MedicoId, mi.InstituicaoId });

            // Relacionamento Medico -> MedicoInstituicao
            builder
                .HasOne(mi => mi.Medico)
                .WithMany(m => m.InstituicoesVinculos) // adicionaremos isto no Medico
                .HasForeignKey(mi => mi.MedicoId)
                .HasConstraintName("fk_medico_instituicao_medico")
                .OnDelete(DeleteBehavior.Cascade);

            // Relacionamento Instituicao -> MedicoInstituicao
            builder
                .HasOne(mi => mi.Instituicao)
                .WithMany(i => i.MedicosVinculos) // adicionaremos isto em Instituicao
                .HasForeignKey(mi => mi.InstituicaoId)
                .HasConstraintName("fk_medico_instituicao_instituicao")
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
