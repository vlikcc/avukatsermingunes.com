using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace guneshukuk.EntityLayer.Dtos.BookingDate
{
    public class ResultBookingDateDto
    {
        public int BookingDateId { get; set; }
        public string Dates { get; set; }
        public DateOnly AvailableDate { get; set; }
        public ICollection<Entities.Booking> Bookings { get; }
    }
}
