using guneshukuk.WebUIv2.Models.Dtos.AboutDtos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http;

namespace guneshukuk.WebUIv2.Controllers
{
    public class AboutController (IHttpClientFactory httpClientFactory): Controller
    {
        public  async Task< IActionResult> Index()
        {
            HttpClient httpClient = httpClientFactory.CreateClient();
            var responseMessage = await httpClient.GetAsync("https://guneshukukwebapi20240505152248.azurewebsites.net/api/About/GetAll");
            if (responseMessage.IsSuccessStatusCode)
            {
                var jsonData = await responseMessage.Content.ReadAsStringAsync();
                var values = JsonConvert.DeserializeObject<List<ResultAboutDto>>(jsonData);
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
