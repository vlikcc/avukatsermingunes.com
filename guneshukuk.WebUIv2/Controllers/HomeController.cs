using Microsoft.AspNetCore.Mvc;

namespace guneshukuk.WebUIv2.Controllers
{
    public class HomeController() : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
