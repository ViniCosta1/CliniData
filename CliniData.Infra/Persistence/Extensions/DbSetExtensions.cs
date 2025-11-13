using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using CliniData.Domain.ValueObjects;


namespace CliniData.Infra.Persistence.Extensions;
public static class DbSetExtensions
{
    public static Task<TEntity?> FirstOrDefaultByValueAsync<TEntity, TProperty>(
        this DbSet<TEntity> dbSet,
        Expression<Func<TEntity, TProperty>> property,
        IValueObject<TProperty> value)
        where TEntity : class
    {
        var valueToCompare = value.Valor;
        var predicate = Expression.Lambda<Func<TEntity, bool>>(
            Expression.Equal(
                property.Body,
                Expression.Constant(valueToCompare)
            ),
            property.Parameters
        );

        return dbSet.FirstOrDefaultAsync(predicate);
    }
}
