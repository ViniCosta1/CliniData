namespace CliniData.Domain.Exceptions;

public sealed class InvalidEnderecoException : BusinessRuleException
{
    public InvalidEnderecoException(string message) : base(message) { }
}