using guneshukuk.EntityLayer.Entities;
using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDateDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Diagnostics;
using Newtonsoft.Json;
using System.Text;

namespace guneshukuk.WebUIv2.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Policy = "RequireAdminRole")]
  
    public class BookingDateController(IHttpClientFactory httpClientFactory) : Controller
    {
        public IActionResult CreateBookingDate()
        {
            return View();
        }

        [HttpPost]
         public async Task<IActionResult> CreateBookingDate(CreateBookingDateDto createBookingDateDto)
        {
            var httpClient = httpClientFactory.CreateClient();
           
			var jsonData = JsonConvert.SerializeObject(createBookingDateDto);
			StringContent content = new StringContent(jsonData,Encoding.UTF8,"application/json");
            var responseMessage = await httpClient.PostAsync("https://guneshukukwebapi20240505152248.azurewebsites.net/api/BookingDate/CreateBookingDate", content);
            if(responseMessage.IsSuccessStatusCode) 
            {
                return RedirectToAction("CreateBookingDate");
            }
             return View();

        }

      

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetBookingDates( ResultBookingDateDto resultBookingDateDto)
        {
            var httpClient = httpClientFactory.CreateClient();
            var responseMessage = await httpClient.GetAsync("https://guneshukukwebapi20240505152248.azurewebsites.net/api/BookingDate/GetAll");
          
            
            if(responseMessage.IsSuccessStatusCode)
            {
				var jsonData = await responseMessage.Content.ReadAsStringAsync();


                var values = JsonConvert.DeserializeObject<List<BookingDate>>(jsonData);
                List<DateOnly> dates = new List<DateOnly>();
                if (values!=null)
                {
					foreach (var item in values)
					{
						foreach (var date in item.BookingDates)
                        {
                            dates.Add(date);
                        }

					}

					
					resultBookingDateDto.Dates = dates;


					
				}
                return View(resultBookingDateDto);

            }
            return View();
        }

    }
}
