using guneshukuk.EntityLayer.Entities;
using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace guneshukuk.WebUIv2.Areas.Admin.Controllers
{
	[Area("Admin")]
    [AllowAnonymous]
	public class RegisterController (UserManager<AppUser> userManager): Controller
	{
        [HttpGet]
		public IActionResult Register()
		{
			return View();
		}

        [HttpPost]
		public async Task<IActionResult> Register(RegisterDto registerDto)
		{
            var appUser = new AppUser()
            {
                Name = registerDto.Name,
                Surname = registerDto.Surname,
                Email = registerDto.Email,
                UserName = registerDto.UserName,
               
            };
            var result = await userManager.CreateAsync(appUser, registerDto.Password);
            if (result.Succeeded)
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
    }

	}

