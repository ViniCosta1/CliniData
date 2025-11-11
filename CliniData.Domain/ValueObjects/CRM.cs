using CliniData.Domain.Enums;
using CliniData.Domain.Exceptions;
using CliniData.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace CliniData.Domain.ValueObjects;

[Owned]
public sealed class CRM : ValueObjects, IValueObject<string>
{
    private static readonly Regex Pattern = new(@"^(?<num>\d{4,6})[\/\s-]?(?<uf>[A-Za-z]{2})$", RegexOptions.Compiled);

    public string Valor { get; }

    protected CRM()
    {
        Valor = "000000/SP";
    }

    public CRM(string input)
    {
        var normalized = Normalize(input);
        if (!IsValid(normalized))
            throw new InvalidCRMException(input);

        Valor = normalized;
    }

    public string Numero => Valor[..Valor.IndexOf('/')];
    public UF UF => Enum.Parse<UF>(Valor[^2..]);

    public override string ToString() => Valor;

    public static string Normalize(string? input)
    {
        if (string.IsNullOrEmpty(input)) return string.Empty;
        var raw = input.Trim().ToUpperInvariant();
        var m = Pattern.Match(raw);
        if (!m.Success) return string.Empty;
        var num = m.Groups["num"].Value;
        var uf = m.Groups["uf"].Value;
        return $"{num}/{uf}";
    }

    public static bool IsValid(string input)
    {
        var m = Pattern.Match(input ?? string.Empty);
        if (!m.Success) return false;
        var ufText = m.Groups["uf"].Value.ToUpperInvariant();
        return Enum.TryParse<UF>(ufText, out _);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Valor;
    }
}
