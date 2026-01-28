using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloggingApp.API.Models
{
    public class Blog
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public string Category { get; set; }

        // ✅ NEW: Thumbnail URL
        public string? ThumbnailUrl { get; set; }

        public int LikesCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // FK
        public int UserId { get; set; }

        // Navigation (DO NOT store username here)
        [ForeignKey("UserId")]
        public User Author { get; set; }
    }
}
