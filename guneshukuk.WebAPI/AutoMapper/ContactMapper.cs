using AutoMapper;
using guneshukuk.EntityLayer.Dtos.Contact;
using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.WebAPI.AutoMapper
{
    public class ContactMapper : Profile
    {
        public ContactMapper()
        {
            CreateMap<Contact, ResultContactDto>().ReverseMap();
            CreateMap<Contact, CreateContactDto>().ReverseMap();
            CreateMap<Contact, UpdateContactDto>().ReverseMap();
            CreateMap<Contact, GetContactDto>().ReverseMap();
        }
    }
}
