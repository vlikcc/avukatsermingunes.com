using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingTimeDtos
{
    public class UpdateBookingTimeDto
    {
        public int BookingTimeId { get; set; }
        public TimeOnly AvailableTime { get; set; }
    }
}
