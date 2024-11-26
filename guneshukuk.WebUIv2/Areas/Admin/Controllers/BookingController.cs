using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace guneshukuk.WebUIv2.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Policy = "RequireAdminRole")]
   
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

        [HttpPost]
        public async Task<IActionResult> UpdateBooking(UpdateBookingDto updateBookingDto)
        {
            HttpClient httpClient = httpClientFactory.CreateClient();
            var jsonData = JsonConvert.SerializeObject(updateBookingDto);
            StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");
            var responseMessage = await httpClient.PutAsync("https://guneshukukwebapi1.azurewebsites.net/api/Booking/UpdateBooking", content);
            if (responseMessage.IsSuccessStatusCode)
            {
                return RedirectToAction("ListBookings");
            }
            return View();

        }

        [HttpGet]

        public async Task<IActionResult> UpdateBooking (int id)
        {
           HttpClient client = httpClientFactory.CreateClient();
            var responseMessage = await client.GetAsync($"https://guneshukukwebapi1.azurewebsites.net/api/Booking/GetBookingById?Id={id}");
            if(responseMessage.IsSuccessStatusCode)
            {
                var jsonData = await responseMessage.Content.ReadAsStringAsync(); 
                var value = JsonConvert.DeserializeObject(jsonData);
                return View(value);

            }
            return View();
        }

        public async Task<IActionResult> DeleteBooking (int id)
        {
            HttpClient client = httpClientFactory.CreateClient();
            var response = await client.DeleteAsync($"https://guneshukukwebapi1.azurewebsites.net/api/Booking/DeleteBooking/{id}");
            if (response.IsSuccessStatusCode)
            {
                return RedirectToAction("ListBookings");
            }
            return View("ListBookings");  
        }
    }
    
}
