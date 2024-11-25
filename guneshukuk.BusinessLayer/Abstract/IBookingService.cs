using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.BusinessLayer.Abstract
{
    public interface IBookingService : IGenericService<Booking>
    {
       public List<Booking> GetAllBookingsWithDate();
    }
}
