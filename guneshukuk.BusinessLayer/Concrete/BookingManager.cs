using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.DataAccessLayer.Abstract;
using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.BusinessLayer.Concrete
{
    public class BookingManager : IBookingService
    {
        private readonly IBookingDal _bookingDal;
        private readonly IBookingDateDal _bookingDateDal;
        private readonly IBookingTimeDal _bookingTimeDal;

        public BookingManager(IBookingDal bookingDal,IBookingDateDal bookingDateDal,IBookingTimeDal bookingTimeDal )
        {
            _bookingDal = bookingDal;
            _bookingDateDal= bookingDateDal;
            _bookingTimeDal = bookingTimeDal;
        }

        public List<Booking> GetAllBookingsWithDate()
        {
            return _bookingDal.GetAllIncluding(b => b.BookingDate);
        }

        public void TAdd(Booking entity)
        {
          _bookingDal.Add(entity);
            
        }

        public void TDelete(Booking entity)
        {
            _bookingDal.Delete(entity);
        }

        public List<Booking> TGetAll()
        {
            return _bookingDal.GetAll();
        }

        public Booking TGetById(int id)
        {
            return _bookingDal.GetById(id);
        }

        public void TUpdate(Booking entity)
        {
            _bookingDal.Update(entity);
        }
    }
}
