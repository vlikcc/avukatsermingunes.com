using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDateDtos;
using guneshukuk.WebUIv2.Models.Dtos.BookingDtos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
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
            ResultBookingDateDto resultBookingDateDto = new ResultBookingDateDto
            {
                Dates = new List<DateOnly>()
            };

            var values = bookingDateService.TGetAll();
            for (int i = 0; i < values.Count; i++)
            {
                foreach (var date in values[i].AvailableDates)
                {
                    resultBookingDateDto.Dates.Add(date);
                }
            }

            CreateBookingDto createBookingDto = new CreateBookingDto();
            ListBookingDateDto listBookingDateDto = new ListBookingDateDto
            {
                ResultBookingDateDto = resultBookingDateDto,
                CreateBookingDto = createBookingDto
            };

            return View(listBookingDateDto);
        }

        [HttpPost]
        public async Task<IActionResult> Index(ListBookingDateDto listBookingDateDto)
        {
            // Reinitialize ResultBookingDateDto to avoid null reference exception
            if (listBookingDateDto.ResultBookingDateDto == null)
            {
                listBookingDateDto.ResultBookingDateDto = new ResultBookingDateDto
                {
                    Dates = new List<DateOnly>()
                };
                var values = bookingDateService.TGetAll();
                for (int i = 0; i < values.Count; i++)
                {
                    foreach (var date in values[i].AvailableDates)
                    {
                        listBookingDateDto.ResultBookingDateDto.Dates.Add(date);
                    }
                }
            }

            if (ModelState.IsValid)
            {
                HttpClient httpClient = httpClientFactory.CreateClient();
                var jsonData = JsonConvert.SerializeObject(listBookingDateDto.CreateBookingDto);
                StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                var responseMessage = await httpClient.PostAsync("https://guneshukukwebapi.azurewebsites.net/api/Booking/CreateBooking", content);
                if (responseMessage.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
                }
                else
                {
                    var errorContent = await responseMessage.Content.ReadAsStringAsync();
                    Console.WriteLine(errorContent); // Hata mesajını loglayın veya debug edin
                }
            }
            else
            {
                // Model binding hatalarını kontrol edin ve loglayın
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                Console.WriteLine(string.Join(", ", errors));
            }
            return View(listBookingDateDto);
        }
    }
}
