using System.ComponentModel.DataAnnotations.Schema;

namespace BloggingApp.API.Models
{
    public class BlogLike
    {
        public int Id { get; set; }

        public int BlogId { get; set; }
        public int UserId { get; set; }

        [ForeignKey("BlogId")]
        public Blog Blog { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
