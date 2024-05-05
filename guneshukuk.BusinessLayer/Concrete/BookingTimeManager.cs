using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.DataAccessLayer.Abstract;
using guneshukuk.EntityLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guneshukuk.BusinessLayer.Concrete
{
    public class BookingTimeManager(IBookingTimeDal bookingTimeDal) : IBookingTimeService
    {
        public void TAdd(BookingTime entity)
        {
            bookingTimeDal.Add(entity);
        }

        public void TDelete(BookingTime entity)
        {
            bookingTimeDal.Delete(entity);
        }

        public List<BookingTime> TGetAll()
        {
           return bookingTimeDal.GetAll();
        }

        public BookingTime TGetById(int id)
        {
            return bookingTimeDal.GetById(id);
        }

        public void TUpdate(BookingTime entity)
        {
            bookingTimeDal.Update(entity);
        }
    }
}
