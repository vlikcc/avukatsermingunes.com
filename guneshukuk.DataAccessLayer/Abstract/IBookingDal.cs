using System.Linq.Expressions;
using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.DataAccessLayer.Abstract
{
    public interface IBookingDal : IGenericDal<Booking>
    {
        List<Booking> GetAllIncluding(params Expression<Func<Booking, object>>[] includeProperties);
    }
}
