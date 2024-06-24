using guneshukuk.EntityLayer.Entities;
using guneshukuk.WebUIv2.Models.Dtos.ArticleDtos;

namespace guneshukuk.WebUIv2.Models.ViewModels
{
    public class ArticleListViewModel
    {
        public List<Article> Articles { get; set; }
        public int CurrentPage {  get; set; }
        public int TotalPages {  get; set; }
    }
}
