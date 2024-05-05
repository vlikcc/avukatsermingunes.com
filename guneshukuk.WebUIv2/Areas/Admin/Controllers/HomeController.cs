using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace guneshukuk.WebUIv2.Areas.Admin.Controllers
{
	[Area("Admin")]
    [Authorize(Policy = "RequireAdminRole")]
    
    public class HomeController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}
	}
}
