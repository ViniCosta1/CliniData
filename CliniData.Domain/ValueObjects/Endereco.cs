using System;

public class Endereco
{
    public string Rua { get; private set; }
    public string Numero { get; private set; }
    public string Complemento { get; private set; }
    public string Bairro { get; private set; }
    public string Cidade { get; private set; }
    public string Estado { get; private set; }
    public string CEP { get; private set; }

    public Endereco(
        string rua,
        string numero,
        string complemento,
        string bairro,
        string cidade,
        string estado,
        string cep)
    {
        if (string.IsNullOrWhiteSpace(rua))
            throw new ArgumentException("Rua é obrigatória.");
        if (string.IsNullOrWhiteSpace(cidade))
            throw new ArgumentException("Cidade é obrigatória.");
        if (string.IsNullOrWhiteSpace(estado))
            throw new ArgumentException("Estado é obrigatório.");
        if (!IsValidCEP(cep))
            throw new ArgumentException("CEP inválido.");

        Rua = rua;
        Numero = numero;
        Complemento = complemento;
        Bairro = bairro;
        Cidade = cidade;
        Estado = estado;
        CEP = cep;
    }

    private static bool IsValidCEP(string cep)
    {
        if (string.IsNullOrWhiteSpace(cep)) return false;
        cep = cep.Replace("-", "");
        return cep.Length == 8 && long.TryParse(cep, out _);
    }

    public string GetEnderecoCompleto()
    {
        return $"{Rua}, {Numero} {Complemento}, {Bairro}, {Cidade} - {Estado}, CEP: {CEP}";
    }
}