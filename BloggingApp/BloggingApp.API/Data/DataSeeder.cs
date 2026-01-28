using BloggingApp.API.Models;
using BCrypt.Net;

namespace BloggingApp.API.Data
{
    public static class DataSeeder
    {
        public static void SeedAdmin(AppDbContext context)
        {
            // Check if any admin already exists
            if (!context.Users.Any(u => u.Role == "ADMIN"))
            {
                var admin = new User
                {
                    Username = "admin",
                    Email = "admin@blogapp.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "ADMIN",
                    CreatedAt = DateTime.UtcNow,
                    IsBlocked = false
                };

                context.Users.Add(admin);
                context.SaveChanges();
            }
        }
    }
}
