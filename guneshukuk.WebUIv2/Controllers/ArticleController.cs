using guneshukuk.WebUIv2.Models.Dtos.ArticleDtos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http;

namespace guneshukuk.WebUIv2.Controllers
{
    public class ArticleController (IHttpClientFactory httpClientFactory): Controller
    {
        public async Task<IActionResult> Index()
        {
            HttpClient httpClient = httpClientFactory.CreateClient();
            var responseMessage = await httpClient.GetAsync("https://guneshukukwebapi20240505152248.azurewebsites.net/api/Article/GetAll");
            if (responseMessage.IsSuccessStatusCode)
            {
                var jsonData = await responseMessage.Content.ReadAsStringAsync();
                var values = JsonConvert.DeserializeObject<List<ResultArticleDto>>(jsonData);
                return View(values);
            }
            return View();
        }
    }
}
