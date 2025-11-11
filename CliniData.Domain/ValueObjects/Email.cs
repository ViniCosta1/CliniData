using CliniData.Domain.Exceptions;
using CliniData.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;



namespace CliniData.Domain.ValueObjects;

[Owned]
public sealed class Email : ValueObjects, IValueObject<string>
{
    private static readonly Regex BasicPattern = new(@"^\S+@\S+\.\S+$", RegexOptions.Compiled);

    public string Valor { get; }

    protected Email()
    {
        Valor = "placeholder@example.com";
    }

    public Email(string email)
    {
        var normalized = Normalize(email);
        if (!IsValid(normalized))
            throw new InvalidEmailException(email);

        Valor = normalized;
    }

    public static bool TryCreate(string? email, out Email? valueObject)
    {
        valueObject = null;
        var normalized = Normalize(email);
        if (!IsValid(normalized)) return false;
        valueObject = new Email(normalized);
        return true;
    }

    public override string ToString() => Valor;

    public static string Normalize(string? input)
    {
        if (string.IsNullOrEmpty(input)) return string.Empty;
        return input.Trim().ToLowerInvariant();
    }

    public static bool IsValid(string email)
    {
        if (string.IsNullOrEmpty(email) || email.Length > 254) return false;
        if (!BasicPattern.IsMatch(email)) return false;

        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address.Equals(email, StringComparison.OrdinalIgnoreCase);
        }
        catch
        {
            return false;
        }
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Valor;
    }
}
