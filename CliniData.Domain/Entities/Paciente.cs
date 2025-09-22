using System;
using CliniData.Domain.ValueObjects;
public class Paciente
{
    public int IdPaciente { get; private set; }
    public string Nome { get; private set; }
    public DateTime DataNascimento { get; private set; }
    public string Sexo { get; private set; }
    public CPF CPF { get; private set; }
    public string Telefone { get; private set; }
    public Email Email { get; private set; }
    public Endereco Endereco { get; private set; }

    public Paciente(
        int idPaciente,
        string nome,
        DateTime dataNascimento,
        string sexo,
        CPF cpf,
        string telefone,
        Email email,
        Endereco endereco)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome é obrigatório.");
        if (cpf == null)
            throw new ArgumentException("CPF é obrigatório.");
        if (email == null)
            throw new ArgumentException("Email é obrigatório.");
        if (endereco == null)
            throw new ArgumentException("Endereço é obrigatório.");

        IdPaciente = idPaciente;
        Nome = nome;
        DataNascimento = dataNascimento;
        Sexo = sexo;
        CPF = cpf;
        Telefone = telefone;
        Email = email;
        Endereco = endereco;
    }

    // Exemplo de métodos complementares
    public int CalcularIdade()
    {
        var hoje = DateTime.Today;
        var idade = hoje.Year - DataNascimento.Year;
        if (DataNascimento.Date > hoje.AddYears(-idade)) idade--;
        return idade;
    }

    public bool EhMenorDeIdade() => CalcularIdade() < 18;
}