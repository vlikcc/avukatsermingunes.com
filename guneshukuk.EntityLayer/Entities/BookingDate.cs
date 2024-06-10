using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guneshukuk.EntityLayer.Entities
{
    public class BookingDate
    {
        [Key]
        public int BookingDateId { get; set; }

        public DateOnly Date { get; set; }
        
        
     
    }
}
