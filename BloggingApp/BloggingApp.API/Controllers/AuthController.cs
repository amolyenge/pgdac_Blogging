using BloggingApp.API.Data;
using BloggingApp.API.DTOs;
using BloggingApp.API.Helpers;
using BloggingApp.API.Models;
using BloggingApp.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BloggingApp.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtTokenGenerator _jwt;
        private readonly IEmailService _email;

        public AuthController(AppDbContext context, JwtTokenGenerator jwt, IEmailService email)
        {
            _context = context;
            _jwt = jwt;
            _email = email;
        }

        // REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (dto.Password != dto.ConfirmPassword)
                return BadRequest("Passwords do not match");

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already exists");

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Registration successful");
        }

        // LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            if (user.IsBlocked)
                return Unauthorized("Account blocked by admin");

            var token = _jwt.GenerateToken(user);

            return Ok(new { token, role = user.Role });
        }

        // FORGOT PASSWORD
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return NotFound("User not found");

            var otp = new Random().Next(100000, 999999).ToString();

            user.Otp = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(5);

            await _context.SaveChangesAsync();

            _email.SendEmail(dto.Email, "Password Reset OTP",
                $"<h3>Your OTP is: {otp}</h3>");

            return Ok("OTP sent to email");
        }

        // RESET PASSWORD
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null ||
                user.Otp != dto.Otp ||
                user.OtpExpiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired OTP");

            if (dto.NewPassword != dto.ConfirmPassword)
                return BadRequest("Passwords do not match");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.Otp = null;
            user.OtpExpiry = null;

            await _context.SaveChangesAsync();

            return Ok("Password reset successful");
        }
    }
}
