using System.ComponentModel.DataAnnotations;

namespace BloggingApp.API.DTOs
{
    public class ReportBlogDto
    {
        [Required]
        public string Reason { get; set; }
    }
}
