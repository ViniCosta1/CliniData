using CliniData.Infra.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CliniData.Infra.Persistence.Configurations;

public sealed class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.ToTable("aspnetusers"); // padrão do Identity

        // Índices já existem por padrão, mas você pode adicionar os seus
        builder.HasIndex(u => u.Email).HasDatabaseName("ix_aspnetusers_email");

        // Ligações com o domínio (FK opcionais; crie se quiser integridade referencial)
        builder.Property(u => u.UserRole);
        // Se quiser FK de verdade, adicione navegações no ApplicationUser e configure aqui.
        // Como alternativa, mantenha apenas os IDs e trate na aplicação.
    }
}