using guneshukuk.EntityLayer.Entities;
using guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace guneshukuk.WebUIv2.Areas.Admin.Controllers
{
    [AllowAnonymous]
    [Area("Admin")]
    public class LoginController(SignInManager<AppUser> signInManager) : Controller
    {
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]

        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var result = await signInManager.PasswordSignInAsync(loginDto.UserName, loginDto.Password,false,false);
            if(result.Succeeded)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
            
        }

      
        public async Task<IActionResult> Logout()
        {
          await signInManager.SignOutAsync();
            return RedirectToAction("Login", "Login");
        }

      


    }
}
