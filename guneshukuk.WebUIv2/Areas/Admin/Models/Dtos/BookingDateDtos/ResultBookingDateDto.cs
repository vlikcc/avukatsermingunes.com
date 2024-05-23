using guneshukuk.EntityLayer.Entities;
using Microsoft.AspNetCore.Authorization;

namespace guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDateDtos
{
    [AllowAnonymous]
    public class ResultBookingDateDto
    {
        public List<DateOnly> Dates { get; set; }
    }
}
