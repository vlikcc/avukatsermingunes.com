using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace guneshukuk.WebUIv2.Areas.Admin.Controllers
{
    [Authorize(Policy = "RequireAdminRole")]
	[Area("Admin")]
    public class AdminLayoutController : Controller
	{
		public IActionResult Index()
		{
			return View("~/Areas/Admin/Views/AdminLayout/Index.cshtml");
		}
	}
}
