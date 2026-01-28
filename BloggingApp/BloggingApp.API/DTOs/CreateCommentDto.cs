using System.ComponentModel.DataAnnotations;

namespace BloggingApp.API.DTOs
{
    public class CreateCommentDto
    {
        [Required]
        public string Content { get; set; }
    }
}
