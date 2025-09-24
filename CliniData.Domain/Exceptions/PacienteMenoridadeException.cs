namespace CliniData.Domain.Exceptions;

public sealed class PacienteMenoridadeException : BusinessRuleException
{
    public PacienteMenoridadeException() : base("Paciente menor de idade deve ter um responsável.") { }
}