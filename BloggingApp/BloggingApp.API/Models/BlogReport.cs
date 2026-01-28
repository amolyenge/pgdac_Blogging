using System.ComponentModel.DataAnnotations.Schema;

namespace BloggingApp.API.Models
{
    public class BlogReport
    {
        public int Id { get; set; }

        public int BlogId { get; set; }
        public int UserId { get; set; }

        public string Reason { get; set; }

        public DateTime ReportedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("BlogId")]
        public Blog Blog { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
