using System.Collections.Generic;
using System.Linq;



namespace CliniData.Domain.ValueObjects;
public abstract class ValueObjects
{
    protected abstract IEnumerable<object?> GetEqualityComponents();
    public override bool Equals(object? obj)
    {
        if (obj is null || obj.GetType() != GetType()) return false;

        var other = (ValueObjects)obj;

        return GetEqualityComponents().SequenceEqual(other.GetEqualityComponents());

    }

    public override int GetHashCode()
    {
        return GetEqualityComponents().Aggregate(0, (hash, obj) =>
        {
            unchecked
            {
                return (hash * 397) ^ (obj?.GetHashCode() ?? 0);
            }
        });
    }
    public static bool operator ==(ValueObjects? a, ValueObjects? b)
        => a is null && b is null || a is not null && a.Equals(b);

    public static bool operator !=(ValueObjects? a, ValueObjects? b)
        => !(a == b);
}
