
namespace CliniData.Domain.ValueObjects;

public interface IValueObject<T>
{
    T Valor { get; }
}
