using AutoMapper;
using guneshukuk.EntityLayer.Dtos.AppUser;
using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.WebAPI.AutoMapper
{
	public class AppUserMapper:Profile
	{
		public AppUserMapper() 
		{
			CreateMap<AppUser,AppUserRegisterDto>().ReverseMap();
		}
	}
}
