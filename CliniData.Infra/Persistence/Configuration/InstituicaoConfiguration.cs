using CliniData.Domain.Entities;
using CliniData.Infra.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class InstituicaoConfiguration : IEntityTypeConfiguration<Instituicao>
{
    public void Configure(EntityTypeBuilder<Instituicao> builder)
    {
        builder.ToTable("instituicao");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.Nome).HasMaxLength(100).IsRequired();
        builder.Property(i => i.Cnpj).HasMaxLength(18).IsRequired();

        builder.HasOne<ApplicationUser>()
               .WithMany()
               .HasForeignKey(i => i.UserId)
               .HasConstraintName("fk_instituicao_user")
               .OnDelete(DeleteBehavior.Cascade);
    }
}
