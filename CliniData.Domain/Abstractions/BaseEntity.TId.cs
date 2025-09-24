using System.Collections.Generic;

namespace CliniData.Domain.Abstractions;

public abstract class BaseEntity<TId> : BaseEntity
{
    public virtual TId Id { get; protected set; } = default!;

    public override bool Equals(object? obj)
    {
        if (obj is not BaseEntity<TId> other) return false;
        if (ReferenceEquals(this, other)) return true;

        if (EqualityComparer<TId>.Default.Equals(Id, default!)) return false;
        if (EqualityComparer <TId>.Default.Equals(other.Id, default!)) return false;

        return EqualityComparer<TId>.Default.Equals(Id, other.Id);

    }

    public override int GetHashCode()
    {
        return EqualityComparer<TId>.Default.GetHashCode(Id);
    }

}
