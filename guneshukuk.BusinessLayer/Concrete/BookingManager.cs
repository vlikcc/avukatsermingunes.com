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

     

        public void TAdd(Booking entity)
        {
            var availableDates = _bookingDateDal.GetAll();
            List<int> ids = new List<int>();
            foreach(var date in availableDates)
            {
                ids.Add(date.BookingDateId);
            }

            var availableTimes = _bookingTimeDal.GetAll();
            if (ids.Contains(entity.BookingDateId) ) 
            {
                throw new Exception("deneme");
            }
            
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
