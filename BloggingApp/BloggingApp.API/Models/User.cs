using System.ComponentModel.DataAnnotations;

namespace BloggingApp.API.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public string Role { get; set; } = "USER"; // USER or ADMIN

        public bool IsBlocked { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? Otp { get; set; }
        public DateTime? OtpExpiry { get; set; }

    }
}
