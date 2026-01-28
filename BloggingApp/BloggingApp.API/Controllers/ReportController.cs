using BloggingApp.API.Data;
using BloggingApp.API.DTOs;
using BloggingApp.API.Helpers;
using BloggingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BloggingApp.API.Controllers
{
    [ApiController]
    [Route("api/reports")]
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // REPORT BLOG (USER)
        // =========================
        [Authorize]
        [HttpPost("{blogId}")]
        public async Task<IActionResult> ReportBlog(int blogId, ReportBlogDto dto)
        {
            int userId = UserContextHelper.GetUserId(User);

            var blog = await _context.Blogs.FindAsync(blogId);
            if (blog == null)
                return NotFound("Blog not found");

            var report = new BlogReport
            {
                BlogId = blogId,
                UserId = userId,
                Reason = dto.Reason,
                ReportedAt = DateTime.UtcNow
            };

            _context.BlogReports.Add(report);
            await _context.SaveChangesAsync();

            return Ok("Blog reported successfully");
        }

        // =========================
        // ADMIN VIEW ALL REPORTS
        // =========================
        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public async Task<IActionResult> GetAllReports()
        {
            var reports = await _context.BlogReports
                .Include(r => r.Blog)
                    .ThenInclude(b => b.Author)
                .Include(r => r.User)
                .OrderByDescending(r => r.ReportedAt)
                .Select(r => new
                {
                    r.Id,
                    r.Reason,
                    r.ReportedAt,

                    Blog = new
                    {
                        r.Blog.Id,
                        r.Blog.Title,
                        Author = r.Blog.Author.Username
                    },

                    ReportedBy = r.User.Username
                })
                .ToListAsync();

            return Ok(reports);
        }

        // =========================
        // ADMIN VIEW REPORT BY ID
        // =========================
        [Authorize(Roles = "ADMIN")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReportById(int id)
        {
            var report = await _context.BlogReports
                .Include(r => r.Blog)
                    .ThenInclude(b => b.Author)
                .Include(r => r.User)
                .Where(r => r.Id == id)
                .Select(r => new
                {
                    r.Id,
                    r.Reason,
                    r.ReportedAt,

                    Blog = new
                    {
                        r.Blog.Id,
                        r.Blog.Title,
                        r.Blog.Content,
                        r.Blog.ThumbnailUrl,
                        Author = r.Blog.Author.Username
                    },

                    ReportedBy = r.User.Username
                })
                .FirstOrDefaultAsync();

            if (report == null)
                return NotFound("Report not found");

            return Ok(report);
        }

        // =========================
        // ADMIN DELETE REPORT BY ID
        // =========================
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            var report = await _context.BlogReports.FindAsync(id);

            if (report == null)
                return NotFound("Report not found");

            _context.BlogReports.Remove(report);
            await _context.SaveChangesAsync();

            return Ok("Report deleted successfully");
        }

    }
}
