using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.EntityLayer.Dtos.Booking
{
    public class CreateBookingDto
    {

        public string BookingName { get; set; }
        public string BookingEmail { get; set; }
        public string BookingPhone { get; set; }
        public string BookingMessage { get; set; }
        public int BookingDateId { get; set; }
        
         
    }
}
