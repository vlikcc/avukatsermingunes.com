using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace guneshukuk.EntityLayer.Entities
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }        
        public string BookingName { get; set; }
        public string BookingEmail { get; set; }
        public string BookingPhone { get; set; }
        public string BookingMessage { get; set; }

        [ForeignKey("BookingDateId")]
        public int BookingDateId { get; set; }

        public BookingDate BookingDate { get; set; }
       
       
        
    }
}
