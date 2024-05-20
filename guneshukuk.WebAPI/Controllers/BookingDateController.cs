using AutoMapper;
using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.EntityLayer.Dtos.BookingDate;
using guneshukuk.EntityLayer.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace guneshukuk.WebAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BookingDateController (IBookingDateService bookingDateService, IMapper mapper): ControllerBase
	{
		[HttpPost("CreateBookingDate")]

		public IActionResult CreateBookingDate (CreateBookingDateDto createBookingDateDto )
		{

			string[] tempData = createBookingDateDto.Dates.Split('-');
            DateOnly start = DateOnly.Parse(tempData[0]);
            DateOnly end = DateOnly.Parse(tempData[1]);
            List<DateOnly> dates = new List<DateOnly>();

            for (var date = start; date < end; date = date.AddDays(1))
            {
                dates.Add(date);
            }

			BookingDate bookingDate = new BookingDate();
			bookingDate.Dates = createBookingDateDto.Dates;
			bookingDate.AvailableDates = dates;
			bookingDateService.TAdd(bookingDate);
			
			return Ok(bookingDate);


        }

        [HttpGet("GetBookingDates")]

		public IActionResult GetBookingDates()
		{
			var values = bookingDateService.TGetAll();
			return Ok(values);

		}
	}
}
