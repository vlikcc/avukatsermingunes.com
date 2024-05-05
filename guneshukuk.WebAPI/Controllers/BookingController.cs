using AutoMapper;
using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.EntityLayer.Dtos.Booking;
using guneshukuk.EntityLayer.Entities;
using Microsoft.AspNetCore.Mvc;

namespace guneshukuk.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        public BookingController(IBookingService bookingService, IMapper mapper, IEmailService emailService)
        {
            _bookingService = bookingService;
            _mapper = mapper;
            _emailService = emailService;
        }
        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var values = _bookingService.TGetAll();
            return Ok(values);
        }
        [HttpGet("GetBookingById")]
        public IActionResult GetArticleById(int id)
        {
            var value = _bookingService.TGetById(id);
            return Ok(value);
        }
        [HttpPost("CreateBooking")]
        public IActionResult CreateBooking(CreateBookingDto createBookingDto)
        {
           
          
            
            var value = _mapper.Map<Booking>(createBookingDto);
            _bookingService.TAdd(value);

            _emailService.SendBookingConfirmationEmail(value);
            return Ok();

        }

        [HttpPut("UpdateBooking")]
        public IActionResult UpdateBooking(UpdateBookingDto updateBookingDto)
        {
            var value = _mapper.Map<Booking>(updateBookingDto);
            _bookingService.TUpdate(value);
            return Ok(value);
        }
        [HttpDelete("DeleteBooking/{id}")]
        public IActionResult DeleteBooking(int id)
        {
            var value = _bookingService.TGetById(id);
            _bookingService.TDelete(value);
            return Ok();
        }

       
        
    }
}
