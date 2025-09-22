
namespace CliniData.Domain.Exceptions;
internal class InvalidEmailException: BusinessRuleException
{
    public InvalidEmailException(string email) : base($"Email inválido: {email}") { }
}

