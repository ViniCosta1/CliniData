namespace CliniData.Domain.Exceptions;


public sealed class InvalidCRMException : BusinessRuleException
{
    public InvalidCRMException(string crm) : base($"CRM inválido: '{crm}'. Formato esperado: '12345/SP'.")
    { }
}