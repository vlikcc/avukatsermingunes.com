namespace guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.ContactDtos
{
    public class CreateContactDto
    {
        public int ContactId { get; set; }
        public string Location { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }
}
