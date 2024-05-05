using guneshukuk.DataAccessLayer.Abstract;
using guneshukuk.DataAccessLayer.Concrete;
using guneshukuk.DataAccessLayer.Repositories;
using guneshukuk.EntityLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guneshukuk.DataAccessLayer.EntitiyFramework
{
    public class EfBookingTimeDal : GenericRepository<BookingTime>, IBookingTimeDal
    {
        public EfBookingTimeDal(GuneshukukContext context) : base(context)
        {
        }
    }
}
