using CliniData.Domain.Abstractions;
using CliniData.Domain.Enums;
using CliniData.Domain.ValueObjects;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CliniData.Domain.Entities
{
    [Table("paciente")]
    public class Paciente : BaseEntity<int>
    {
        public string Nome { get; private set; }

        private DateTime _dataNascimento;
        public DateTime DataNascimento
        {
            get => _dataNascimento;
            set => _dataNascimento = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }

        public Sexo Sexo { get; private set; }

        public CPF CPF { get; private set; }

        public string? Telefone { get; private set; }

        public Email Email { get; private set; }

        // Endereço como navegação (1:1)
        public Endereco Endereco { get; private set; }

        // manter UserId, mas NÃO no construtor/factory
        public int UserId { get; private set; }

        protected Paciente() { } // EF Core

        private Paciente(
            string nome,
            DateTime dataNascimento,
            Sexo sexo,
            CPF cpf,
            string telefone,
            Email email,
            Endereco endereco)
        {
            Nome = nome;
            DataNascimento = dataNascimento;
            Sexo = sexo;
            CPF = cpf;
            Telefone = telefone;
            Email = email;
            Endereco = endereco;
        }

        public static Paciente Criar(
            string nome,
            DateTime dataNascimento,
            Sexo sexo,
            CPF cpf,
            string telefone,
            Email email,
            Endereco endereco)
        {
            return new Paciente(nome, dataNascimento, sexo, cpf, telefone, email, endereco);
        }

        public void AtualizarDados(
            string nome,
            DateTime dataNascimento,
            Sexo sexo,
            CPF cpf,
            string telefone,
            Email email,
            Endereco endereco)
        {
            Nome = nome;
            DataNascimento = dataNascimento;
            Sexo = sexo;
            CPF = cpf;
            Telefone = telefone;
            Email = email;
            Endereco = endereco;
        }

        // método explícito para vincular o usuário Identity (chame do AuthService)
        public void VincularUsuario(int userId)
        {
            UserId = userId;
        }
    }
}
