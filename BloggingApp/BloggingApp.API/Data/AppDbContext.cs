using BloggingApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace BloggingApp.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<BlogLike> BlogLikes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<BlogReport> BlogReports { get; set; }



    }
}
