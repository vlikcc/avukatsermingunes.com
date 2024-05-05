namespace guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDtos
{
    public class ResultBookingDto
    {
        public int BookingId { get; set; }
        public string BookingName { get; set; }
        public string BookingEmail { get; set; }
        public string BookingPhone { get; set; }
        public string BookingMessage { get; set; }
        public DateTime BookingDate { get; set; }
    }
}
