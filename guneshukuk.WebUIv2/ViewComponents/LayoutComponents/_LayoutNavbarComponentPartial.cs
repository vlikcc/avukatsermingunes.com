using Microsoft.AspNetCore.Mvc;

namespace guneshukuk.WebUIv2.ViewComponents.LayoutComponents
{
    public class _LayoutNavbarComponentPartial : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
