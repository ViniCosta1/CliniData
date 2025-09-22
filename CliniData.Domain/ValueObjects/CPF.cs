using System.Linq;
using System.Text.RegularExpressions;
using CliniData.Domain.Exceptions;


namespace CliniData.Domain.ValueObjects;

public sealed class CPF : ValueObjects
{
    private static readonly Regex DigitsOnly = new(@"^\d{11}$", RegexOptions.Compiled);
        
    public string Value { get; }

    protected CPF()
    {
        Value = "000000000000";
    }

    public CPF(string cpf)
    {
        var normalized = Normalize(cpf);
        if (!IsValid(normalized))
            throw new InvalidCPFException("CPF inválido!");

        Value = normalized;
    }

    public override string ToString() => ToMasked(Value);

    public static string ToMasked(string digits11)
    {
        if (!DigitsOnly.IsMatch(digits11)) return digits11;
        return $"{digits11[..3]}.{digits11[3..6]}.{digits11[6..9]}-{digits11[9..]}";

    }

    public static string Normalize(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        return new string(input.Where(char.IsDigit).ToArray());

    }

    public static bool IsValid(string digits11)
    {
        if (!DigitsOnly.IsMatch(digits11)) return false;
        if (digits11.Distinct().Count() == 1) return false;
            
        int CalcDV(ReadOnlySpan<char> span, int length)
        {
            int sum = 0, weight = length + 1;
            for (int i = 0; i < length; i++)
                sum += (span[i] - '0') * weight--;
            int mod = sum % 11;
            return mod < 2 ? 0 : 11 - mod;
        }

        var dv1 = CalcDV(digits11, 9);
        var dv2 = CalcDV(digits11, 10);
        return dv1 == (digits11[9] - '0') && dv2 == (digits11[10] - '0');
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }

}
