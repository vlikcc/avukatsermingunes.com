using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.ConsultancyDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;

namespace guneshukuk.WebUIv2.Areas.Admin.Controllers
{
	[Area("Admin")]
    [Authorize(Policy = "RequireAdminRole")]
    public class ConsultancyController(IHttpClientFactory httpClientFactory) : Controller
	{
		public IActionResult CreateConsultancy()
		{
			return View();
		}

		[HttpPost]
		public async Task<IActionResult> CreateConsultancy(CreateConsultancyDto createConsultancyDto)
		{
			var httpClient = httpClientFactory.CreateClient();
			var jsonData = JsonConvert.SerializeObject(createConsultancyDto);
			StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");
			var responseMessage = await httpClient.PostAsync("https://guneshukukwebapi20240505152248.azurewebsites.net/api/Consultancy/CreateConsultancy", content);
			if (responseMessage.IsSuccessStatusCode)
			{
				return RedirectToAction("ListConsultancies");
			}
			return View();
		}


		[HttpGet]
		public async Task<IActionResult> ListConsultancies()
		{
			HttpClient httpClient = httpClientFactory.CreateClient();
			var responseMessage = await httpClient.GetAsync("https://guneshukukwebapi20240505152248.azurewebsites.net/api/Consultancy/GetAll");
			if (responseMessage.IsSuccessStatusCode)
			{
				var jsonData = await responseMessage.Content.ReadAsStringAsync();
				var values = JsonConvert.DeserializeObject<List<ResultConsultancyDto>>(jsonData);
				if (values != null)
				{
					return View(values);
				}

				return View();
			}

			return View();
		}




		public async Task<IActionResult> DeleteConsultancy(int id)
		{
			HttpClient httpClient = httpClientFactory.CreateClient();
			var response = await httpClient.DeleteAsync($"https://guneshukukwebapi20240505152248.azurewebsites.net/api/Consultancy/DeleteConsultancy/{id}");
			if (response.IsSuccessStatusCode)
			{
				return RedirectToAction("ListConsultancies");
			}
			return View();




		}

		[HttpGet]
		public async Task<IActionResult> UpdateConsultancy(int Id)
		{
			HttpClient httpclient = httpClientFactory.CreateClient();
			var responseMessage = await httpclient.GetAsync($"https://guneshukukwebapi20240505152248.azurewebsites.net/api/Consultancy/GetConsultancyById?Id={Id}");

			if (responseMessage.IsSuccessStatusCode)
			{
				var jsonData = await responseMessage.Content.ReadAsStringAsync();
				var value = JsonConvert.DeserializeObject<UpdateConsultancyDto>(jsonData);

				return View(value);
			}
			return View();

		}

		[HttpPost]
		public async Task<IActionResult> UpdateConsultancy(UpdateConsultancyDto updateConsultancyDto)
		{
			HttpClient httpClient = httpClientFactory.CreateClient();
			var jsonData = JsonConvert.SerializeObject(updateConsultancyDto);
			StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");
			var responseMessage = await httpClient.PutAsync("https://guneshukukwebapi20240505152248.azurewebsites.net/api/Consultancy/UpdateConsultancy", content);
			if (responseMessage.IsSuccessStatusCode)
			{
				return RedirectToAction("ListConsultancies");
			}
			return View();
		}
	}
}

