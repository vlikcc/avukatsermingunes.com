using System.Linq.Expressions;
using guneshukuk.DataAccessLayer.Abstract;
using guneshukuk.DataAccessLayer.Concrete;
using guneshukuk.DataAccessLayer.Repositories;
using guneshukuk.EntityLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace guneshukuk.DataAccessLayer.EntitiyFramework
{
    public class EfBookingDal : GenericRepository<Booking>, IBookingDal
    {
        public EfBookingDal(GuneshukukContext context) : base(context)
        {

        }

        public List<Booking> GetAllIncluding(params Expression<Func<Booking, object>>[] includeProperties)
        {
            IQueryable<Booking> query = _context.Set<Booking>();
            foreach (var includeProperty in includeProperties) { query = query.Include(includeProperty); }
            return query.ToList();
        }
    }
}
