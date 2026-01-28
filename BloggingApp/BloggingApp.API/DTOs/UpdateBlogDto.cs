using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

public class UpdateBlogDto
{
    [Required]
    public string Title { get; set; }

    [Required]
    public string Content { get; set; }

    [Required]
    public string Category { get; set; }

    // Accept file upload
    public IFormFile? Thumbnail { get; set; }
}
