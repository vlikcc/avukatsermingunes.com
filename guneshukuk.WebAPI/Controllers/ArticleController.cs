using AutoMapper;
using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.EntityLayer.Dtos.Article;
using guneshukuk.EntityLayer.Entities;
using Microsoft.AspNetCore.Mvc;

namespace guneshukuk.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleService _articleService;
        private readonly IMapper _mapper;

        public ArticleController(IArticleService articleService, IMapper mapper)
        {
            _articleService = articleService;
            _mapper = mapper;
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var values = _articleService.TGetAll();
            return Ok(values);
        }

        [HttpGet("GetArticleById")]
        public IActionResult GetArticleById(int id)
        {
            var value = _articleService.TGetById(id);
            return Ok(value);
        }

        [HttpPost("CreateArticle")]
        public IActionResult CreateArticle(CreateArticleDto createArticleDto)
        {
            var value = _mapper.Map<Article>(createArticleDto);
            _articleService.TAdd(value);
            return Ok();
        }

        [HttpDelete("DeleteArticle/{id}")]
        public IActionResult DeleteArticle(int id)
        {
            var value = _articleService.TGetById(id);
            _articleService.TDelete(value);
            return Ok();
        }

        [HttpPut("UpdateArticle")]

        public IActionResult UpdateArticle(UpdateArticleDto updateArticleDto)
        {
            var value = _mapper.Map<Article>(updateArticleDto);
            _articleService.TUpdate(value);
            return Ok(value);
        }

    }
}
