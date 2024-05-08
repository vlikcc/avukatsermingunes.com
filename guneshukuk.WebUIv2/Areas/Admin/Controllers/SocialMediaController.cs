using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.SocialMediaDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace guneshukuk.WebUIv2.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Policy = "RequireAdminRole")]
    public class SocialMediaController (IHttpClientFactory httpClientFactory): Controller
    {
        public IActionResult CreateSocialMedia()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CreateSocialMedia(CreateSocialMediaDto createSocialMediaDto)
        {
            var httpClient = httpClientFactory.CreateClient();
            var jsonData = JsonConvert.SerializeObject(createSocialMediaDto);
            StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");
            var responseMessage = await httpClient.PostAsync("https://guneshukukwebapi20240505152248.azurewebsites.net/api/SocialMedia/CreateSocialMedia", content);
            if (responseMessage.IsSuccessStatusCode)
            {
                return RedirectToAction("ListSocialMedias");
            }
            return View();
        }


        [HttpGet]
        public async Task<IActionResult> ListSocialMedias()
        {
            HttpClient httpClient = httpClientFactory.CreateClient();
            var responseMessage = await httpClient.GetAsync("https://guneshukukwebapi20240505152248.azurewebsites.net/api/SocialMedia/GetAll");
            if (responseMessage.IsSuccessStatusCode)
            {
                var jsonData = await responseMessage.Content.ReadAsStringAsync();
                var values = JsonConvert.DeserializeObject<List<ResultSocialMediaDto>>(jsonData);
                if (values != null) 
                {
                    return View(values);
                }
                return View();
            }

            return View();
        }




        public async Task<IActionResult> DeleteSocialMedia(int id)
        {
            HttpClient httpClient = httpClientFactory.CreateClient();
            var response = await httpClient.DeleteAsync($"https://guneshukukwebapi20240505152248.azurewebsites.net/api/SocialMedia/DeleteSocialMedia/{id}");
            if (response.IsSuccessStatusCode)
            {
                return RedirectToAction("ListSocialMedias");
            }
            return View();




        }

        [HttpGet]
        public async Task<IActionResult> UpdateSocialMedia(int Id)
        {
            HttpClient httpclient = httpClientFactory.CreateClient();
            var responseMessage = await httpclient.GetAsync($"https://guneshukukwebapi20240505152248.azurewebsites.net/api/SocialMedia/GetSocialMediaById?Id={Id}");



            if (responseMessage.IsSuccessStatusCode)
            {
                var jsonData = await responseMessage.Content.ReadAsStringAsync();
                var value = JsonConvert.DeserializeObject<UpdateSocialMediaDto>(jsonData);

                return View(value);
            }
            return View();

        }

        [HttpPost]
        public async Task<IActionResult> UpdateSocialMedia(UpdateSocialMediaDto updateSocialMediaDto)
        {
            HttpClient httpClient = httpClientFactory.CreateClient();
            var jsonData = JsonConvert.SerializeObject(updateSocialMediaDto);
            StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");
            var responseMessage = await httpClient.PutAsync("https://guneshukukwebapi20240505152248.azurewebsites.net/api/SocialMedia/UpdateSocialMedia", content);
            if (responseMessage.IsSuccessStatusCode)
            {
                return RedirectToAction("ListSocialMedias");
            }
            return View();
        }
    }
}
