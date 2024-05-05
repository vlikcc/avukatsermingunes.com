using AutoMapper;
using guneshukuk.EntityLayer.Dtos.BookingTime;
using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.WebAPI.AutoMapper
{
    public class BookingTimeMapper:Profile
    {
        public BookingTimeMapper()
        {
            CreateMap<BookingTime, CreateBookingTimeDto>().ReverseMap();
            CreateMap<BookingTime,UpdateBookingTimeDto>().ReverseMap();
        }
    }
}
