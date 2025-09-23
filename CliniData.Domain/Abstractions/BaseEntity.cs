using System.Collections.Generic;

namespace CliniData.Domain.Abstractions;


public abstract class BaseEntity
{
    private readonly List<IDomainEvent> _domianEvents = new();
    
    public DateTime CriadoEmUtc { get; private set; }
    public DateTime? AtualizadoEmUtc { get; private set; }

    protected BaseEntity()
    {
        CriadoEmUtc = DateTime.UtcNow;
    }

    public IReadOnlyCollection <IDomainEvent> DomainEvents => _domianEvents.AsReadOnly();
    protected void AdicionarEvento(IDomainEvent @event) => _domianEvents.Add(@event);
    public void LimparEventos() => _domianEvents.Clear();

    protected void MarcarAtualizado(DateTime agoraUtc) => AtualizadoEmUtc = agoraUtc;


}