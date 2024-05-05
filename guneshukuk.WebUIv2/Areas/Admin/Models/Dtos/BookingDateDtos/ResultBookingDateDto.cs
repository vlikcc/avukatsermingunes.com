using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDateDtos
{
    public class ResultBookingDateDto
    {
        public int BookingDateId { get; set; }
        public string Dates { get; set; }
        public List<DateOnly> AvailableDates { get; set; }
        public ICollection<Booking> Bookings { get; }
    }
}
