using System;
using System.Text.RegularExpressions;
using System.Net.Mail;
using CliniData.Domain.Exceptions;


namespace CliniData.Domain.ValueObjects;

public sealed class Email: ValueObjects
{
    private static readonly Regex BasicPattern = new(@"^\S+@\S+\.S+$", RegexOptions.Compiled);

    public string Value { get; }

    protected Email()
    {
        Value = "placeholder@example.com";
    }
    
    public Email(string email)
    {
        var normalized = Normalize(email);
        if (!IsValid(normalized))
            throw new InvalidEmailException("email");

        Value = normalized;
    }

    public static bool TryCreate(string? email, out Email? valueObject)
    {
        valueObject = null;
        var normalized = Normalize(email);
        if (!IsValid(normalized)) return false;
        valueObject = new Email(normalized);
        return true;
    }

    public override string ToString() => Value;

    public static string Normalize(string? input)
    {
        if (string.IsNullOrEmpty(input)) return string.Empty;
        return input.Trim().ToLowerInvariant();

    }

    public static bool IsValid(string email)
    {
        if (string.IsNullOrEmpty(email)) return false;
        if (email.Length > 254) return false;
        if (!BasicPattern.IsMatch(email)) return false;

        try
        {
            var addr = new MailAddress(email);

            return addr.Address.Equals(email, StringComparison.OrdinalIgnoreCase);

        }
        catch
        {
            return false;
        }
    }
    
    protected override System.Collections.Generic.IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;        
    }

}


//public class Email
//{
//    public string Value { get; private set; }

//    public Email(string email)
//    {
//        if (!IsValid(email))
//            throw new ArgumentException("Email inválido!");

//        Value = email.Trim().ToLower();
//    }

//    public static bool IsValid(string email)
//    {
//        if (string.IsNullOrWhiteSpace(email))
//            return false;

//        // Validação simples usando Regex
//        var pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
//        return Regex.IsMatch(email, pattern, RegexOptions.IgnoreCase);
//    }

//    public override string ToString() => Value;
//}