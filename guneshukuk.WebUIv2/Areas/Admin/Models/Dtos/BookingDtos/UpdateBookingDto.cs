using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDtos
{
    public class UpdateBookingDto
    {
        public int BookingId { get; set; }
        public string BookingName { get; set; }
        public string BookingEmail { get; set; }
        public string BookingPhone { get; set; }
        public string BookingMessage { get; set; }
        public BookingDate BookingDate { get; set; }
    }
}
