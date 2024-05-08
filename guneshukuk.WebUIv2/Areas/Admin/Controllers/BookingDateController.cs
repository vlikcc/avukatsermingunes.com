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
            string[] tempdates = createBookingDateDto.Dates.Split("-");
            DateOnly start = DateOnly.Parse(tempdates[0]);
            DateOnly end = DateOnly.Parse(tempdates[1]);
            List<DateOnly> dates = new List<DateOnly>();
            for(DateOnly date =start; date<=end; date = date.AddDays(1))
            {
                dates.Add(date);
            }
            createBookingDateDto.AvailableDates = dates;
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
           List<DateOnly> bookedDates = new List<DateOnly>();
            List<string> tempData = new List<string>();
            List<string> tempDates = new List<string>(); ;
            
            if(responseMessage.IsSuccessStatusCode)
            {
				var jsonData = await responseMessage.Content.ReadAsStringAsync();
               
                
               var results = JsonConvert.DeserializeObject<List<ResultBookingDateDto>>(jsonData);
                if(results!=null)
                {
					foreach (var item in results)
					{
						tempData.Add(item.Dates);

					}

					foreach (var item in tempData)
					{

						var value = item.Split("-").First();
						var value2 = item.Split("-")[1];
						DateOnly start = DateOnly.Parse(value);
						DateOnly end = DateOnly.Parse(value2);
						for (DateOnly date = start; date <= end; date = date.AddDays(1))
						{

							bookedDates.Add(date);
						}
					}
					resultBookingDateDto.AvailableDates = bookedDates;


					return View(resultBookingDateDto);
				}
                 return View();
                
			}
            return View("CreateBookingDate");
        }

    }
}
