using guneshukuk.EntityLayer.Dtos.BookingDateDtos;
using guneshukuk.EntityLayer.Entities;
using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.BookingDateDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Diagnostics;
using Newtonsoft.Json;
using System.Text;
using CreateBookingDateDto = guneshukuk.EntityLayer.Dtos.BookingDateDtos.CreateBookingDateDto;


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
         public async Task<IActionResult> CreateBookingDate(CreateBookingDateViewModel createBookingDateViewModel)
        {
            string[] tempData=createBookingDateViewModel.Dates.Split('-');
            DateOnly start = DateOnly.ParseExact(tempData[0].Trim(),"dd/MM/yyyy");
            DateOnly end = DateOnly.ParseExact(tempData[1].Trim(), "dd/MM/yyyy");
            List<DateOnly> dates = new List<DateOnly>();

            for (var date = start; date <= end; date = date.AddDays(1))
            {
                dates.Add(date);
            }

            CreateBookingDateDto createBookingDateDto = new CreateBookingDateDto();
            createBookingDateDto.Dates = dates;
            var httpClient = httpClientFactory.CreateClient();
           
			var jsonData = JsonConvert.SerializeObject(createBookingDateDto);
			StringContent content = new StringContent(jsonData,Encoding.UTF8,"application/json");
            var responseMessage = await httpClient.PostAsync("https://guneshukukwebapi.azurewebsites.net/api/BookingDate/CreateBookingDate", content);
            if(responseMessage.IsSuccessStatusCode) 
            {
                return RedirectToAction("CreateBookingDate");
            }
             return View();

        }

      

        [HttpGet]
        [AllowAnonymous]
    
        public async Task<IActionResult> GetBookingDates( Models.Dtos.BookingDateDtos.ResultBookingDateDto resultBookingDateDto)
        {
            var httpClient = httpClientFactory.CreateClient();
            var responseMessage = await httpClient.GetAsync("https://guneshukukwebapi.azurewebsites.net/api/BookingDate/GetBookingDates");
          
            
            if(responseMessage.IsSuccessStatusCode)
            {
				var jsonData = await responseMessage.Content.ReadAsStringAsync();


                var values = JsonConvert.DeserializeObject<List<BookingDate>>(jsonData);               
                
                if (values!=null)
                {
					resultBookingDateDto.BookingDates = values;
                   
				}
                return View(resultBookingDateDto);

            }
            return View();
        }

    }
}
