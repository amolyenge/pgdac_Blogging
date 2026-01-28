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
    [Route("api/comments")]
    public class CommentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // ADD COMMENT (USER)
        // =========================
        [Authorize]
        [HttpPost("{blogId}")]
        public async Task<IActionResult> AddComment(int blogId, CreateCommentDto dto)
        {
            int userId = UserContextHelper.GetUserId(User);

            var blogExists = await _context.Blogs.AnyAsync(b => b.Id == blogId);
            if (!blogExists)
                return NotFound("Blog not found");

            var comment = new Comment
            {
                BlogId = blogId,
                UserId = userId,
                Content = dto.Content
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok("Comment added");
        }

        // =========================
        // GET COMMENTS BY BLOG
        // =========================
        [HttpGet("blog/{blogId}")]
        public async Task<IActionResult> GetCommentsByBlog(int blogId)
        {
            var comments = await _context.Comments
                .Where(c => c.BlogId == blogId)
                .OrderBy(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    Author = c.User.Username
                })
                .ToListAsync();

            return Ok(comments);
        }
    }
}
