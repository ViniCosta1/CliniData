using System;
using System.Linq;
using System.Text.RegularExpressions;
using CliniData.Domain.Enums;
using CliniData.Domain.Exceptions;


namespace CliniData.Domain.ValueObjects;

public sealed class Endereco : ValueObjects
{
    private static readonly Regex CepDigits = new(@"^\d{8}$", RegexOptions.Compiled);

    public string Rua { get; }
    public string Numero { get; }
    public string? Complemento { get; }
    public string Bairro { get; }
    public string Cidade { get; }
    public UF UF { get; } // 2 letras
    public string CEP { get; }  // armazenado como 8 dígitos (sem máscara)

    protected Endereco()
    {
        Rua = Numero = Bairro = Cidade = CEP = String.Empty;
        UF = UF.SP;
    }

    public Endereco(
         string rua,
         string numero,
         string? complemento,
         string bairro,
         string cidade,
         UF estadoUF,
         string cep
        )
    {
        Rua = NormalizeRequired(rua, "Rua é obrigatória.");
        Numero = NormalizeRequired(numero, "Número é obrigatório.");
        Complemento = string.IsNullOrWhiteSpace(complemento) ? null : complemento.Trim();
        Bairro = NormalizeRequired(bairro, "Bairro é obrigatório.");
        Cidade = NormalizeRequired(cidade, "Cidade é obrigatória.");
        UF = estadoUF;
        CEP = NormalizeCEP(cep);
    }

    public static Endereco CreateFromString(
        string rua,
        string numero,
        string? complemento,
        string bairro,
        string cidade,
        string ufString,
        string cep
        )
    {
        if (!Enum.TryParse<UF>(ufString?.Trim().ToUpperInvariant(), out var uf))
            throw new InvalidEnderecoException("UF inválida.");
        return new Endereco(
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            cep);

    }

    public override string ToString()
    {
        var comp = string.IsNullOrEmpty(Complemento) ? "" : $" - {Complemento}";
        return $"{Rua}, {Numero}{comp}, {Bairro}, {Cidade} - {UF}, CEP: {ToMasked(CEP)}";
    }

    public static string ToMasked(string digits8) => CepDigits.IsMatch(digits8) ? $"{digits8[..5]}-{digits8[5..]}" : digits8;


    public static string NormalizeCEP(string input)
    {
        var digits = new string((input ?? "").Where(char.IsDigit).ToArray());
        if(!CepDigits.IsMatch(digits))
            throw new InvalidEnderecoException("CEP inválido. Deve conter 8 dígitos.");
        return digits;
    }

    public static string NormalizeRequired(string input, string error)
    {
        if(string.IsNullOrWhiteSpace(input))
            throw new InvalidEnderecoException(error);
        return input.Trim();
    }

    protected override System.Collections.Generic.IEnumerable<object?> GetEqualityComponents()
    {
        yield return Rua;
        yield return Numero;
        yield return Complemento;
        yield return Bairro;
        yield return Cidade;
        yield return UF;
        yield return CEP;
    }




}