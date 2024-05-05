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
			
			foreach(var date in createBookingDateDto.AvailableDates) 
			{
				BookingDate bookingDate = new BookingDate();
				bookingDate.AvailableDate = date;
				bookingDate.Dates=createBookingDateDto.Dates;
				bookingDateService.TAdd(bookingDate);
			}
			return Ok();

		}

		[HttpGet("GetAll")]

		public IActionResult GetBookingDates()
		{
			var values = bookingDateService.TGetAll();
			return Ok(values);

		}
	}
}
