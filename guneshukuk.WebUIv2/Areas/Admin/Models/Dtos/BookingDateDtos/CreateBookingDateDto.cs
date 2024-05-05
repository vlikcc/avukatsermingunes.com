using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDateDtos
{
    public class CreateBookingDateDto
    {
              public  string Dates { get; set; }
              public List<DateOnly> AvailableDates { get; set; }
    }
}
