using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guneshukuk.EntityLayer.Dtos.BookingDate
{
    public class UpdateBookingDateDto
    {
        public int BookingDateId { get; set; }  
        public DateOnly BookingDate { get; set; }
    }
}
