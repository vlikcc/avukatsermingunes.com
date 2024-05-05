using Microsoft.AspNetCore.Mvc;

namespace guneshukuk.WebUIv2.ViewComponents.LayoutComponents
{
    public class _LayoutHeaderComponentPartial : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
