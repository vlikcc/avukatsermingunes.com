using AutoMapper;
using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.EntityLayer.Dtos.Consultancy;
using guneshukuk.EntityLayer.Entities;
using Microsoft.AspNetCore.Mvc;

namespace guneshukuk.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsultancyController : ControllerBase
    {
        private IConsultancyService _consultancyService;
        private IMapper _mapper;

        public ConsultancyController(IConsultancyService consultancyService, IMapper mapper)
        {
            _consultancyService = consultancyService;
            _mapper = mapper;
        }
        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var values = _consultancyService.TGetAll();
            return Ok(values);
        }
        [HttpGet("GetConsultancyById")]
        public IActionResult GetConsultancyById(int id)
        {
            var value = _consultancyService.TGetById(id);
            return Ok(value);
        }
        [HttpPost("CreateConsultancy")]
        public IActionResult CreateConsultancy(CreateConsultancyDto createConsultancyDto)
        {
            var value = _mapper.Map<Consultancy>(createConsultancyDto);
            _consultancyService.TAdd(value);
            return Ok();
        }
        [HttpPut("UpdateConsultancy")]
        public IActionResult UpdateConsultancy(UpdateConsultancyDto updateConsultancyDto)
        {
            var value = _mapper.Map<Consultancy>(updateConsultancyDto);
            _consultancyService.TUpdate(value);
            return Ok();
        }

        [HttpDelete("DeleteConsultancy/{id}")]
        public IActionResult DeleteConsultancy(int id)
        {
            var value = _consultancyService.TGetById(id);
            _consultancyService.TDelete(value);
            return Ok();
        }
    }
}
