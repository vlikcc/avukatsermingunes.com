using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guneshukuk.EntityLayer.Entities
{
    public class BookingDate
    {
        public int BookingDateId { get; set; }
        public string Dates { get; set; }
        public List<DateOnly> AvailableDates { get; set; }
         public virtual ICollection<Booking> Bookings { get; set; }
    }
}
