using guneshukuk.WebUIv2.Models.Dtos.ConsultancyDtos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace guneshukuk.WebUIv2.Controllers
{
	public class ConsultancyController(IHttpClientFactory httpClientFactory) : Controller
	{
		public async Task<IActionResult> Index()
		{
			HttpClient httpClient = httpClientFactory.CreateClient();
			var responseMessage = await httpClient.GetAsync("https://guneshukukwebapi.azurewebsites.net/api/Consultancy/GetAll");
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
	}
}
