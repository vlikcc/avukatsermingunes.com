using guneshukuk.DataAccessLayer.Concrete;
using guneshukuk.EntityLayer.Entities;
using guneshukuk.WebUIv2.Models.Dtos.ArticleDtos;
using guneshukuk.WebUIv2.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http;

namespace guneshukuk.WebUIv2.Controllers
{
    public class ArticleController (IHttpClientFactory httpClientFactory,GuneshukukContext context): Controller
    {
        public async Task<IActionResult> Index(int page=1)
        {
            int pageSize = 6;
            var articles = context.Articles.OrderBy(article=>article.ArticleId).Skip((page-1)*pageSize).Take(pageSize).ToList();
            HttpClient httpClient = httpClientFactory.CreateClient();
            var responseMessage = await httpClient.GetAsync("https://guneshukukwebapi.azurewebsites.net/api/Article/GetAll");
            if (responseMessage.IsSuccessStatusCode)
            {
                var jsonData = await responseMessage.Content.ReadAsStringAsync();
                var values = JsonConvert.DeserializeObject<List<ResultArticleDto>>(jsonData);
                if(values!=null)
                {
                    var totalArticles = values.Count();
                    var viewModel = new ArticleListViewModel
                    {
                        Articles = articles,
                        CurrentPage = page,
                        TotalPages = (int)Math.Ceiling((double)totalArticles / pageSize)
                    };
                    return View(viewModel);
				}
                return View();
            }
            return View();
        }

        public async Task<IActionResult> ArticleDetail(int articleId)
        {
            HttpClient httpClient = httpClientFactory.CreateClient();
            string link = "https://guneshukukwebapi.azurewebsites.net/api/Article/GetArticleById?Id=" + articleId;
            var response = await httpClient.GetAsync(link);
            if (response.IsSuccessStatusCode)
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                var article = JsonConvert.DeserializeObject<Article>(jsonData);
                if (article == null)
                {
                    return NotFound();
                }
                return View(article);
            }
            return NotFound();

        }
    }
}
