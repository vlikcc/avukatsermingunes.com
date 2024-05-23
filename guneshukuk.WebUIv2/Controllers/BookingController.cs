using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDateDtos;
using guneshukuk.WebUIv2.Models.Dtos.BookingDtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Localization;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;

namespace guneshukuk.WebUIv2.Controllers
{
    public class BookingController (IHttpClientFactory httpClientFactory, IBookingDateService bookingDateService): Controller
    {
      
        [HttpPost]
        public async Task<IActionResult> Index(ListBookingDateDto listBookingDateDto)
        {
           listBookingDateDto.CreateBookingDto= GetCreateBookingDto();
            HttpClient httpClient = httpClientFactory.CreateClient();
            var jsonData = JsonConvert.SerializeObject(listBookingDateDto.CreateBookingDto);
            StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");
            var responseMessage = await httpClient.PostAsync("https://guneshukukwebapi.azurewebsites.net/api/Booking/CreateBooking", content);
            if (responseMessage.IsSuccessStatusCode)
            {
                return RedirectToAction("Index",listBookingDateDto);

            }
            return View(listBookingDateDto);
           
        }

        public IActionResult Index() 
        {
            ListBookingDateDto listBookingDateDto = new ListBookingDateDto();
            
            listBookingDateDto.CreateBookingDto = GetCreateBookingDto();
            listBookingDateDto.ResultBookingDateDto = GetResultBookingDto();
           
          
            return View( listBookingDateDto); 
        }
        public CreateBookingDto GetCreateBookingDto()
        {
            CreateBookingDto createBookingDto = new CreateBookingDto()
            {
                BookingDate = new DateTime(),
                BookingEmail = null,
                BookingMessage = null,
                BookingName = null,
                BookingPhone = null
         

            };

            return createBookingDto;

        }
        public ResultBookingDateDto GetResultBookingDto ()
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
            return resultBookingDateDto;
        }
    }
}
