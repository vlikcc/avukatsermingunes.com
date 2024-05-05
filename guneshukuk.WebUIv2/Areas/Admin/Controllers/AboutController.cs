using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.AboutDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;

namespace guneshukuk.WebUIv2.Areas.Admin.Controllers
{
    [Area("Admin")]
	[Authorize(Policy = "RequireAdminRole")]
   
    public class AboutController (IHttpClientFactory httpClientFactory): Controller
    {
       public IActionResult CreateAbout()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CreateAbout(CreateAboutDto createAboutDto)
        {
            var httpClient = httpClientFactory.CreateClient();
            var jsonData = JsonConvert.SerializeObject(createAboutDto);
            StringContent content = new StringContent(jsonData,Encoding.UTF8, "application/json");
            var responseMessage = await httpClient.PostAsync("https://localhost:7183/api/About/CreateAbout", content);
            if(responseMessage.IsSuccessStatusCode)
            {
                return RedirectToAction("ListAbouts");
            }
            return View();  
        }


        [HttpGet]
        public async Task<IActionResult> ListAbouts()
        {
			HttpClient httpClient = httpClientFactory.CreateClient();
			var responseMessage = await httpClient.GetAsync("https://localhost:7183/api/About/GetAll");
			if (responseMessage.IsSuccessStatusCode)
			{
				var jsonData = await responseMessage.Content.ReadAsStringAsync();
				var values = JsonConvert.DeserializeObject<List<ResultAboutDto>>(jsonData);
				return View(values);
			}

			return View();
		}

		

	
		public async Task<IActionResult> DeleteAbout(int id)
		{
			HttpClient httpClient = httpClientFactory.CreateClient();
			var response = await httpClient.DeleteAsync($"https://localhost:7183/api/About/DeleteAbout/{id}");
			if(response.IsSuccessStatusCode)
			{
                return RedirectToAction("ListAbouts");
            }
			return View();
			
			
			
			
		}

		[HttpGet]
		public async Task<IActionResult> UpdateAbout(int Id)
		{
			HttpClient httpclient = httpClientFactory.CreateClient();
			var responseMessage = await httpclient.GetAsync($"https://localhost:7183/api/About/GetAboutById?Id={Id}");



			if (responseMessage.IsSuccessStatusCode)
			{
				var jsonData = await responseMessage.Content.ReadAsStringAsync();
				var value = JsonConvert.DeserializeObject<UpdateAboutDto>(jsonData);

				return View(value);
			}
			return View();

		}

		[HttpPost]
		public async Task<IActionResult> UpdateAbout(UpdateAboutDto updateAboutDto)
		{
			HttpClient httpClient = httpClientFactory.CreateClient();
			var jsonData = JsonConvert.SerializeObject(updateAboutDto);
			StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");
			var responseMessage = await httpClient.PutAsync("https://localhost:7183/api/About/UpdateAbout", content);
			if (responseMessage.IsSuccessStatusCode)
			{
				return RedirectToAction("ListAbouts");
			}
			return View();
		}
	}
}
