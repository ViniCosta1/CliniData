
namespace CliniData.Domain.Abstractions;

public abstract record DomainEvent : IDomainEvent
{
    public DateTime OcorreuEmUtc { get; private set; } = DateTime.UtcNow;
}
