using System.Collections.Generic;
using System.Reflection.Emit;
using CliniData.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CliniData.Api.Data
{
    /// <summary>
    /// Contexto do Entity Framework para acessar o banco de dados
    /// </summary>
    public class CliniDataDbContext : DbContext
    {
        public CliniDataDbContext(DbContextOptions<CliniDataDbContext> options) : base(options)
        {
        }

        // Tabela de pacientes
        public DbSet<Paciente> Pacientes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração específica para a entidade Paciente
            modelBuilder.Entity<Paciente>(entity =>
            {
                // Mapear para a tabela existente
                entity.ToTable("Paciente");

                // Configurar chave primária
                entity.HasKey(e => e.IdPaciente);
                entity.Property(e => e.IdPaciente).HasColumnName("IdPaciente").ValueGeneratedOnAdd();

                // Configurar propriedades obrigatórias
                entity.Property(e => e.Nome).HasColumnName("Nome").IsRequired().HasMaxLength(100);
                entity.Property(e => e.DataNascimento).HasColumnName("DataNascimento").IsRequired();
                entity.Property(e => e.CPF).HasColumnName("CPF").IsRequired().HasMaxLength(14);

                // Configurar propriedades opcionais
                entity.Property(e => e.Sexo).HasColumnName("Sexo").HasMaxLength(10);
                entity.Property(e => e.Telefone).HasColumnName("Telefone").HasMaxLength(20);
                entity.Property(e => e.Email).HasColumnName("Email").HasMaxLength(100);
                entity.Property(e => e.Rua).HasColumnName("Rua").HasMaxLength(100);
                entity.Property(e => e.Numero).HasColumnName("Numero").HasMaxLength(10);
                entity.Property(e => e.Complemento).HasColumnName("Complemento").HasMaxLength(30);
                entity.Property(e => e.Bairro).HasColumnName("Bairro").HasMaxLength(50);
                entity.Property(e => e.Cidade).HasColumnName("Cidade").HasMaxLength(50);
                entity.Property(e => e.Estado).HasColumnName("Estado").HasMaxLength(2);
                entity.Property(e => e.CEP).HasColumnName("CEP").HasMaxLength(10);
            });
        }
    }
}