using AutoMapper;
using guneshukuk.EntityLayer.Dtos.Article;
using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.WebAPI.AutoMapper
{
    public class ArticleMapper : Profile
    {
        public ArticleMapper()
        {
            CreateMap<Article, ResultArticleDto>().ReverseMap();
            CreateMap<Article, CreateArticleDto>().ReverseMap();
            CreateMap<Article, UpdateArticleDto>().ReverseMap();
            CreateMap<Article, GetArticleDto>().ReverseMap();
        }
    }
}
