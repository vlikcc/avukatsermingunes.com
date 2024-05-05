using guneshukuk.EntityLayer.Dtos.Booking;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace guneshukuk.WebUIv2.Areas.Admin.Controllers
{
    [Authorize(Policy = "RequireAdminRole")]
    [Area("Admin")]
    public class BookingController (IHttpClientFactory httpClientFactory): Controller
    {
        public IActionResult CreateBooking()
        {
            return View();
        }

       
    }
    
}
