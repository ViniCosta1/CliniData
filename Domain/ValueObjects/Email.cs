using System;
using System.Text.RegularExpressions;

public class Email
{
    public string Value { get; private set; }

    public Email(string email)
    {
        if (!IsValid(email))
            throw new ArgumentException("Email inválido!");

        Value = email.Trim().ToLower();
    }

    public static bool IsValid(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        // Validação simples usando Regex
        var pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
        return Regex.IsMatch(email, pattern, RegexOptions.IgnoreCase);
    }

    public override string ToString() => Value;
}