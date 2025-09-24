

namespace CliniData.Domain.Abstractions;

public interface IDomainEvent
{
    DateTime OcorreuEmUtc { get; }
}
