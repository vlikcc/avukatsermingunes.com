﻿using AutoMapper;
using guneshukuk.EntityLayer.Dtos.Booking;
using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.WebAPI.AutoMapper
{
    public class BookingMapper : Profile
    {
        public BookingMapper()
        {
            CreateMap<Booking, ResultBookingDto>().ReverseMap();
            CreateMap<Booking, CreateBookingDto>().ReverseMap();
            CreateMap<Booking, UpdateBookingDto>().ReverseMap();
            CreateMap<Booking, GetBookingDto>().ReverseMap();


        }
    }
}
