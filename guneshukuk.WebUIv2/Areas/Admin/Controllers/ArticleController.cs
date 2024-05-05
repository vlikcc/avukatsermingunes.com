using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.ArticleDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace guneshukuk.WebUIv2.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Policy = "RequireEditorRole")]
    [Authorize(Policy = "RequireAdminRole")]
    [Authorize(Policy ="RequireSiteOwnerRole")]
    public class ArticleController (IHttpClientFactory httpClientFactory): Controller
    {
        [HttpGet]
        public async Task<IActionResult> ListArticles()
        {
            HttpClient httpClient = httpClientFactory.CreateClient();
            var responseMessage = await httpClient.GetAsync("https://localhost:7183/api/Article/GetAll");
            if(responseMessage.IsSuccessStatusCode) 
            {
                var jsonData = await responseMessage.Content.ReadAsStringAsync();
                var values = JsonConvert.DeserializeObject<List<ResultArticleDto>>(jsonData);
                return View(values);
            }
            return View();
        }

		public IActionResult CreateArticle()
		{
			return View();
		}

		[HttpPost]
		public async Task<IActionResult> CreateArticle(CreateArticleDto createArticleDto)
		{
			var httpClient = httpClientFactory.CreateClient();
			var jsonData = JsonConvert.SerializeObject(createArticleDto);
			StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");
			var responseMessage = await httpClient.PostAsync("https://localhost:7183/api/Article/CreateArticle", content);
			if (responseMessage.IsSuccessStatusCode)
			{
				return RedirectToAction("ListArticles");
			}
			return View();
		}

        [HttpGet]
        public async Task<IActionResult> UpdateArticle(int Id)
        {
            HttpClient httpclient = httpClientFactory.CreateClient();
            var responseMessage = await httpclient.GetAsync($"https://localhost:7183/api/Article/GetArticleById?Id={Id}");



            if (responseMessage.IsSuccessStatusCode)
            {
                var jsonData = await responseMessage.Content.ReadAsStringAsync();
                var value = JsonConvert.DeserializeObject<UpdateArticleDto>(jsonData);

                return View(value);
            }
            return View();

        }

        [HttpPost]
        public async Task<IActionResult> UpdateArticle(UpdateArticleDto updateArticleDto)
        {
            HttpClient httpClient = httpClientFactory.CreateClient();
            var jsonData = JsonConvert.SerializeObject(updateArticleDto);
            StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");
            var responseMessage = await httpClient.PutAsync("https://localhost:7183/api/Article/UpdateArticle", content);
            if (responseMessage.IsSuccessStatusCode)
            {
                return RedirectToAction("ListArticles");
            }
            return View();
        }


		public async Task<IActionResult> DeleteArticle(int id)
		{
			HttpClient httpClient = httpClientFactory.CreateClient();
			var response = await httpClient.DeleteAsync($"https://localhost:7183/api/Article/DeleteArticle/{id}");
			if (response.IsSuccessStatusCode)
			{
				return RedirectToAction("ListArticles");
			}
			return View();




		}
	}
}

