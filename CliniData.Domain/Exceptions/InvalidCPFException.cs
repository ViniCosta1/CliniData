using CliniData.Domain.Exceptions;
using System;

public sealed class InvalidCPFException: BusinessRuleException
{
    public InvalidCPFException(string cpf) : base($"CPF inváido: {cpf}") { }
    
}