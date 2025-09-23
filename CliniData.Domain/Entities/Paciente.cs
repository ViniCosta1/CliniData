using System;
using CliniData.Domain.ValueObjects;
using CliniData.Domain.Exceptions;
using CliniData.Domain.Enums;


public class Paciente
{
    public int IdPaciente { get; private set; }
    public string Nome { get; private set; }
    public DateTime DataNascimento { get; private set; }
    public Sexo Sexo { get; private set; }
    public CPF CPF { get; private set; }
    public string? Telefone { get; private set; }
    public Email Email { get; private set; }
    public Endereco Endereco { get; private set; }

    public string? NomeResponsavel { get; private set; }

    private Paciente()
    {
        Nome = string.Empty;
        Email = new Email("placeholder@example.com");
        CPF = new CPF("00000000000");
        Endereco = new Endereco("", "", "", "", "", UF.SP, "00000000");
    }
    public Paciente(
        int idPaciente,
        string nome,
        DateTime dataNascimento,
        Sexo sexo,
        CPF cpf,
        string telefone,
        Email email,
        Endereco endereco,
        string? nomeResponsavel = null
        )
    {
        IdPaciente = idPaciente;
        Nome = NormalizeRequired(nome, "Nome é obrigatório.");
        DataNascimento = dataNascimento;
        Sexo = sexo;
        CPF = cpf ?? throw new BusinessRuleException("CPF é obrigatório.");
        Telefone = NormalizeRequired(telefone, "Telefone é obrigatório.");
        Email = email ?? throw new BusinessRuleException("Email é obrigatório.");
        Endereco = endereco ?? throw new BusinessRuleException("Endereço é obrigatório.");
        NomeResponsavel = string.IsNullOrWhiteSpace(nomeResponsavel) ? null : nomeResponsavel.Trim();

        ValidarResponsavelParaMenor(DateTime.UtcNow);
    }

    public static string NormalizeRequired(string? valor, string messagemErro)
    {
        if (string.IsNullOrWhiteSpace(valor)) throw new BusinessRuleException(messagemErro);
        return valor.Trim();
    }

    // Exemplo de métodos complementares
    public int CalcularIdade(DateTime hoje)
    {
        var idade = hoje.Year - DataNascimento.Year;
        if (DataNascimento.Date > hoje.AddYears(-idade)) idade--;
        return idade;
    }

    public bool EhMenorDeIdade(DateTime hoje) => CalcularIdade(hoje) < 18;

    public void AtualizarEmail(Email novoEmail)
    {
        Email = novoEmail ?? throw new BusinessRuleException("Email é obrigatório.");
    }

    public void AtualizarTelefone(string novoTelefone)
    {
        Telefone = NormalizeRequired(novoTelefone, "Telefone é obrigatório.");
    }

    public void AtualizarNome(string novoNome)
    {
        Nome = NormalizeRequired(novoNome, "Nome é obrigatório.");
    }

    public void DefinirSexo(Sexo sexo)
    {
        Sexo = sexo;
    }

    public void DefinirResponsavel(string? nomeResponsavel, DateTime hoje)
    {
        NomeResponsavel = NormalizeRequired(nomeResponsavel, "Nome do responsável é obrigatório.");
        ValidarResponsavelParaMenor(hoje);
    }

    public void ValidarResponsavelParaMenor(DateTime hoje)
    {
        if(EhMenorDeIdade(hoje) && string.IsNullOrWhiteSpace(NomeResponsavel))
            throw new PacienteMenoridadeException();
    }




}
