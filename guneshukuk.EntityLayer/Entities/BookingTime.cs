using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guneshukuk.EntityLayer.Entities
{
    public class BookingTime
    {
        public int BookingTimeId { get; set; }       
        public TimeOnly AvailableTime { get; set; }
        public ICollection<Booking> Bookings { get; set; }
    }
}
