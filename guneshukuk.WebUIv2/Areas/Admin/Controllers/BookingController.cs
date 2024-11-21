using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace guneshukuk.WebUIv2.Areas.Admin.Controllers
{
    [Authorize(Policy = "RequireAdminRole")]
    [Area("Admin")]
    public class BookingController (IHttpClientFactory httpClientFactory): Controller
    {
        public IActionResult CreateBooking()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> ListBookings (ResultBookingDto resultBookingDto)
        {
            var httpClient = httpClientFactory.CreateClient();
            var responseMessage = await httpClient.GetAsync("https://guneshukukwebapi1.azurewebsites.net/api/Booking/GetAll");
            if(responseMessage.IsSuccessStatusCode)
            {
                var jsonData = await responseMessage.Content.ReadAsStringAsync();
                var values = JsonConvert.DeserializeObject<List<ResultBookingDto>>(jsonData);
                if(values!=null)
                {
                   
                    return View(values);
                }
                return View();
            }
            return View();
        }

       
    }
    
}
