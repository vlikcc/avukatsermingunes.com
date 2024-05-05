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
       public  string Dates { get; set; }
        public DateOnly AvailableDate { get; set; }
        public ICollection<Booking> Bookings { get;}
    }
}
