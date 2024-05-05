using AutoMapper;
using guneshukuk.EntityLayer.Dtos.BookingDate;
using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.WebAPI.AutoMapper
{
    public class BookingDateMapper:Profile
    {
        public BookingDateMapper()
        {
            CreateMap<BookingDate,CreateBookingDateDto>().ReverseMap();
			CreateMap<List<BookingDate>, CreateBookingDateDto>().ReverseMap();
			CreateMap<BookingDate, UpdateBookingDateDto>().ReverseMap();    
        }
    }
}
