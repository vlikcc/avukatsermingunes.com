using Microsoft.AspNetCore.Mvc;

namespace guneshukuk.WebUIv2.Controllers
{
    public class LayoutController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
