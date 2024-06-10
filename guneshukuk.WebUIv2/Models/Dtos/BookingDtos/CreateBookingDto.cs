using guneshukuk.EntityLayer.Entities;
using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDateDtos;

namespace guneshukuk.WebUIv2.Models.Dtos.BookingDtos
{
    public class CreateBookingViewModel
    {
        public string BookingName { get; set; }
        public string BookingEmail { get; set; }
        public string BookingPhone { get; set; }
        public string BookingMessage { get; set; }        
        public ResultBookingDateDto ResultBookingDate { get; set; }
        
    }
}
