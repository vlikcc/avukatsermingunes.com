using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.ContactDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace guneshukuk.WebUIv2.Areas.Admin.Controllers
{
	[Area("Admin")]
    [Authorize(Policy = "RequireAdminRole")]
    public class ContactController (IHttpClientFactory httpClientFactory): Controller
	{
		public IActionResult CreateContact()
		{
			return View();
		}

		[HttpPost]
		public async Task<IActionResult> CreateContact(CreateContactDto createContactDto)
		{
			var httpClient = httpClientFactory.CreateClient();
			var jsonData = JsonConvert.SerializeObject(createContactDto);
			StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");
			var responseMessage = await httpClient.PostAsync("https://guneshukukwebapi.azurewebsites.net/api/Contact/CreateContact", content);
			if (responseMessage.IsSuccessStatusCode)
			{
				return RedirectToAction("ListContacts");
			}
			return View();
		}


		[HttpGet]
		public async Task<IActionResult> ListContacts()
		{
			HttpClient httpClient = httpClientFactory.CreateClient();
			var responseMessage = await httpClient.GetAsync("https://guneshukukwebapi.azurewebsites.net/api/Contact/GetAll");
			if (responseMessage.IsSuccessStatusCode)
			{
				var jsonData = await responseMessage.Content.ReadAsStringAsync();
				var values = JsonConvert.DeserializeObject<List<ResultContactDto>>(jsonData);
				if(values!=null)
				{
					return View(values);
				}
				return View();
			}

			return View();
		}




		public async Task<IActionResult> DeleteContact(int id)
		{
			HttpClient httpClient = httpClientFactory.CreateClient();
			var response = await httpClient.DeleteAsync($"https://guneshukukwebapi.azurewebsites.net/api/Contact/Deletecontact/{id}");
			if (response.IsSuccessStatusCode)
			{
				return RedirectToAction("ListContacts");
			}
			return View();




		}

		[HttpGet]
		public async Task<IActionResult> UpdateContact(int Id)
		{
			HttpClient httpclient = httpClientFactory.CreateClient();
			var responseMessage = await httpclient.GetAsync($"https://guneshukukwebapi.azurewebsites.net/api/Contact/GetContactById?Id={Id}");



			if (responseMessage.IsSuccessStatusCode)
			{
				var jsonData = await responseMessage.Content.ReadAsStringAsync();
				var value = JsonConvert.DeserializeObject<UpdateContactDto>(jsonData);

				return View(value);
			}
			return View();

		}

		[HttpPost]
		public async Task<IActionResult> UpdateContact(UpdateContactDto updateContactDto)
		{
			HttpClient httpClient = httpClientFactory.CreateClient();
			var jsonData = JsonConvert.SerializeObject(updateContactDto);
			StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");
			var responseMessage = await httpClient.PutAsync("https://guneshukukwebapi.azurewebsites.net/api/Contact/UpdateContact", content);
			if (responseMessage.IsSuccessStatusCode)
			{
				return RedirectToAction("ListContacts");
			}
			return View();
		}
	}
}
