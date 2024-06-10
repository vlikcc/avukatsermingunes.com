using AutoMapper;
using guneshukuk.EntityLayer.Dtos.BookingDateDtos;
using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.WebAPI.AutoMapper
{
    public class BookingDateMapper:Profile
    {
        public BookingDateMapper()
        {
            CreateMap<BookingDate, CreateBookingDateDto>().ReverseMap();
        }
			
    }
}
