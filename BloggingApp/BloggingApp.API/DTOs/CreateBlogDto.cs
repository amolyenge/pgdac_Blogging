using System.ComponentModel.DataAnnotations;

namespace BloggingApp.API.DTOs
{
    public class CreateBlogDto
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public string Category { get; set; }
    }
}
