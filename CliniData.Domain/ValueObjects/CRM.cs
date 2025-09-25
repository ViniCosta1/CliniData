using System.Text.RegularExpressions;
using CliniData.Domain.Exceptions;
using CliniData.Domain.Enums;
using System.Threading.Tasks.Sources;

namespace CliniData.Domain.ValueObjects;

public sealed class CRM : ValueObjects
{
    private static readonly Regex Pattern = new(@"^(?<num>\d{4,6})[\/\s-]?(?<uf>[A-Za-z]{2})$", RegexOptions.Compiled);

    public string Value { get; }

    protected CRM()
    {
        Value = "000000/SP";
    }

    public CRM(string input)
    {
        var normalized = Normalize(input);
        if (!IsValid(normalized))
        {
            throw new InvalidCRMException(input);

        }
        Value = normalized;

    }

    public static bool TryCreate(string? input, out CRM? crm)
    {
        crm = null;
        var normalized = Normalize(input);
        if (!IsValid(normalized)) return false;
        crm = new CRM(normalized);
        return true;
    }

    public string Numero => Value[..Value.IndexOf('/')];
    public UF UF => Enum.Parse<UF>(Value[^2..]);

    public override string ToString() => Value;

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
        var m = Pattern.Match(input);
        if (!m.Success) return false;
        var ufText = m.Groups["uf"].Value.ToUpperInvariant();
        return Enum.TryParse<UF>(ufText, out _);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }
}