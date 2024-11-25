using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.EntityLayer.Dtos.Booking
{
    public class GetBookingDto
    {
        public int BookingId { get; set; }
        public string BookingName { get; set; }
        public string BookingEmail { get; set; }
        public string BookingPhone { get; set; }
        public string BookingMessage { get; set; }
        public BookingDate BookingDate { get; set; }
    }
}
