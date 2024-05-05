using AutoMapper;
using guneshukuk.EntityLayer.Dtos.Consultancy;
using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.WebAPI.AutoMapper
{
    public class ConsultancyMapper : Profile
    {
        public ConsultancyMapper()
        {
            CreateMap<Consultancy, ResultConsultancyDto>().ReverseMap();
            CreateMap<Consultancy, CreateConsultancyDto>().ReverseMap();
            CreateMap<Consultancy, UpdateConsultancyDto>().ReverseMap();
            CreateMap<Consultancy, GetConsultancyDto>().ReverseMap();

        }
    }
}
