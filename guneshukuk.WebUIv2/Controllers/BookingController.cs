using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDateDtos;
using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDtos;
using guneshukuk.WebUIv2.Models.Dtos.BookingDtos;
using Microsoft.AspNetCore.Mvc;

using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace guneshukuk.WebUIv2.Controllers
{
    public class BookingController : Controller
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly IBookingDateService bookingDateService;

        public BookingController(IHttpClientFactory httpClientFactory, IBookingDateService bookingDateService)
        {
            this.httpClientFactory = httpClientFactory;
            this.bookingDateService = bookingDateService;
        }

        [HttpGet]
        public IActionResult Index()
        {
            ResultBookingDateDto resultBookingDateDto = new ResultBookingDateDto();
            resultBookingDateDto.BookingDates = bookingDateService.TGetAll();   
            CreateBookingViewModel createBookingViewModel = new CreateBookingViewModel();
           createBookingViewModel.ResultBookingDate = resultBookingDateDto;

            return View(createBookingViewModel);
        }

        [HttpPost]
        public async Task<IActionResult> Index(CreateBookingViewModel createBookingViewModel , [FromForm] string selectedDate)
        {
            DateOnly bookingDate = DateOnly.ParseExact(selectedDate.Trim(),"yyyy-MM-dd");
            ResultBookingDateDto resultBookingDateDto= new ResultBookingDateDto();
            resultBookingDateDto.BookingDates = bookingDateService.TGetAll();
            createBookingViewModel.ResultBookingDate = resultBookingDateDto;
            CreateBookingDto createBookingDto = new CreateBookingDto()
            {
                BookingName = createBookingViewModel.BookingName,
                BookingPhone = createBookingViewModel.BookingPhone,
                BookingEmail = createBookingViewModel.BookingEmail,
                BookingMessage = createBookingViewModel.BookingMessage,
                BookingDateId = createBookingViewModel.ResultBookingDate.BookingDates.First(b=>b.Date==bookingDate).BookingDateId
            };

            var httpClient = httpClientFactory.CreateClient();
            var jsonData = JsonSerializer.Serialize(createBookingDto);
            StringContent content = new StringContent(jsonData,Encoding.UTF8,"application/json");
            var responseMessage = await httpClient.PostAsync("https://guneshukukwebapi.azurewebsites.net/api/Booking/CreateBooking", content);
            if(responseMessage.IsSuccessStatusCode)
            {
                return View("Index");
            }
            return RedirectToAction("Index");
           
            
        }
    }
}
