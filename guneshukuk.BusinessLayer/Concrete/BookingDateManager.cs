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
    public class BookingDateManager(IBookingDateDal bookingDateDal) : IBookingDateService
    {
        public void TAdd(BookingDate entity)
        {
            bookingDateDal.Add(entity);
        }

        public void TDelete(BookingDate entity)
        {
           bookingDateDal.Delete(entity);
        }

        public List<BookingDate> TGetAll()
        {
           return bookingDateDal.GetAll();
        }

        public BookingDate TGetById(int id)
        {
           return bookingDateDal.GetById(id);
        }

        public void TUpdate(BookingDate entity)
        {
            bookingDateDal.Update(entity);
        }
    }
}
