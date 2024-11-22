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
        private readonly IBookingDateService _bookingDateService;

        public BookingController(IBookingService bookingService, IMapper mapper, IEmailService emailService,IBookingDateService bookingDateService)
        {
            _bookingService = bookingService;
            _mapper = mapper;
            _emailService = emailService;
            _bookingDateService = bookingDateService;
        }
        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var values = _bookingService.TGetAll();
            List<GetBookingDto> result = new List<GetBookingDto>();
            foreach (var value in values)
            {
                var date = _bookingDateService.TGetById(value.BookingDateId);
                GetBookingDto getBookingDto = new GetBookingDto()
              { 
                  BookingId = value.BookingId,
                  BookingDate = Convert.ToDateTime(date),   
                  BookingEmail = value.BookingEmail,
                  BookingMessage = value.BookingMessage,
                  BookingName = value.BookingName,
                  BookingPhone = value.BookingPhone,
              };
                result.Add(getBookingDto);
            }
            
            
            return Ok(result);
        }
        [HttpGet("GetBookingById")]
        public IActionResult GetBookingById(int id)
        {
            var value = _bookingService.TGetById(id);
            return Ok(value);
        }
        [HttpPost("CreateBooking")]
        public IActionResult CreateBooking(CreateBookingDto createBookingDto)
        {

            Booking booking = new Booking()
            {
                BookingDateId = createBookingDto.BookingDateId,
                BookingName = createBookingDto.BookingName,
                BookingEmail = createBookingDto.BookingEmail,
                BookingMessage = createBookingDto.BookingMessage,
                BookingPhone = createBookingDto.BookingPhone
            };
            _bookingService.TAdd(booking);

           
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
