﻿namespace guneshukuk.WebUIv2.Areas.Admin.Models.Dtos.ConsultancyDtos
{
    public class UpdateConsultancyDto
    {
        public int ConsultancyId { get; set; }
        public string ConsultancyTitle { get; set; }
        public string ConsultancyContent { get; set; }
        public string ImageUrl { get; set; }
    }
}
