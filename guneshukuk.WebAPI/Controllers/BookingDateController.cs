using AutoMapper;
using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.EntityLayer.Dtos.BookingDateDtos;
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
			foreach(var date in createBookingDateDto.Dates)
			{
				BookingDate bookingDate = new BookingDate();
				bookingDate.Date = date;
				bookingDateService.TAdd(bookingDate);
			}

			return Ok();


        }

        [HttpGet("GetBookingDates")]

		public IActionResult GetBookingDates()
		{
			var values = bookingDateService.TGetAll();
			return Ok(values);

		}

		[HttpGet("GetBookingDateById")]
		 public IActionResult GetBookingDateById(int id)
		{
			var value = bookingDateService.TGetById(id);
			return Ok(value);
		}
	}
}
