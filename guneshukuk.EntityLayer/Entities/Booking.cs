namespace guneshukuk.EntityLayer.Entities
{
    public class Booking
    {
        public int BookingId { get; set; }        
        public string BookingName { get; set; }
        public string BookingEmail { get; set; }
        public string BookingPhone { get; set; }
        public string BookingMessage { get; set; }       
        public int BookingDateId { get; set; }
        public virtual BookingDate BookingDate { get; set; }

        //public int BookingTimeId { get; set; }
        //public virtual BookingTime BookingTime { get; set; }
        
    }
}
