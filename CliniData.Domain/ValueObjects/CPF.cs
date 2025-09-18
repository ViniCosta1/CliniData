using System;
using System.Linq;

public class CPF
{
    public string Value { get; private set; }

    public CPF(string cpf)
    {
        if (!IsValid(cpf))
            throw new ArgumentException("CPF inválido!");

        Value = FormatCPF(cpf);
    }

    // Validação simplificada!
    public static bool IsValid(string cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf))
            return false;

        cpf = cpf.Replace(".", "").Replace("-", "");

        if (cpf.Length != 11)
            return false;

        if (cpf.All(c => c == cpf[0]))
            return false;

        return true;
    }

    private static string FormatCPF(string cpf)
    {
        return cpf.Replace(".", "").Replace("-", "");
    }

    public override string ToString() => Value;
}