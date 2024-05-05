using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDateDtos
{
    public class UpdateBookingDateDto
    {
        public int BookingDateId { get; set; }
        public DateOnly BookingDate { get; set; }
    }
}
