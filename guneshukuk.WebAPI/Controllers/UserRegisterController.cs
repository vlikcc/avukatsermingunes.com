using AutoMapper;
using guneshukuk.EntityLayer.Dtos.AppUser;
using guneshukuk.EntityLayer.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace guneshukuk.WebAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UserRegisterController (UserManager<AppUser> userManager, IMapper mapper ): ControllerBase
	{
		[HttpPost]
		public  async Task<IActionResult> Register(AppUserRegisterDto appUserRegisterDto)
		{
			var value = mapper.Map<AppUser>(appUserRegisterDto);
			 var result = await userManager.CreateAsync(value,appUserRegisterDto.Password);
			if (result.Succeeded) 
			{
				return Ok();
			}
			return BadRequest();
		}

	}
}
