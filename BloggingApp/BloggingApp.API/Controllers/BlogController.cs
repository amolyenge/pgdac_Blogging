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
    [Route("api/blogs")]
    public class BlogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BlogController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // CREATE BLOG (USER)
        // =========================
        [Authorize]
        [HttpPost]
        [Authorize]
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateBlog(
    [FromForm] CreateBlogDto dto,
    IFormFile thumbnail
)
        {
            if (thumbnail == null || thumbnail.Length == 0)
                return BadRequest("Thumbnail image is required");

            int userId = UserContextHelper.GetUserId(User);

            // 1️⃣ Ensure upload folder exists
            var uploadsFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "uploads",
                "blogs"
            );

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // 2️⃣ Generate unique file name
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(thumbnail.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            // 3️⃣ Save image to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await thumbnail.CopyToAsync(stream);
            }

            // 4️⃣ Generate public URL
            var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/blogs/{fileName}";

            // 5️⃣ Save blog
            var blog = new Blog
            {
                Title = dto.Title,
                Content = dto.Content,
                Category = dto.Category,
                ThumbnailUrl = imageUrl,
                UserId = userId
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Blog created successfully",
                blogId = blog.Id,
                thumbnailUrl = imageUrl
            });
        }


        // =========================
        // GET ALL BLOGS (PUBLIC)
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetAllBlogs()
        {
            var blogs = await _context.Blogs
                .Include(b => b.Author)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Category,
                    b.ThumbnailUrl,          // ✅ NEW
                    b.LikesCount,
                    b.CreatedAt,
                    Author = b.Author.Username
                })
                .ToListAsync();

            return Ok(blogs);
        }

        // =========================
        // GET BLOG BY ID (PUBLIC)
        // =========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlogById(int id)
        {
            var blog = await _context.Blogs
                .Include(b => b.Author)
                .Where(b => b.Id == id)
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Content,
                    b.Category,
                    b.ThumbnailUrl,          // ✅ NEW
                    b.LikesCount,
                    b.CreatedAt,
                    Author = b.Author.Username
                })
                .FirstOrDefaultAsync();

            if (blog == null)
                return NotFound("Blog not found");

            return Ok(blog);
        }

        // =========================
        // UPDATE OWN BLOG (USER)
        // =========================
        [Authorize]
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateBlog(int id, [FromForm] UpdateBlogDto dto)
        {
            int userId = UserContextHelper.GetUserId(User);

            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return NotFound("Blog not found");
            if (blog.UserId != userId) return Forbid("You can update only your own blog");

            // Debugging
            if (dto.Thumbnail == null)
            {
                Console.WriteLine("UPDATE BLOG: dto.Thumbnail is NULL");
            }
            else
            {
                Console.WriteLine("UPDATE BLOG: dto.Thumbnail received: " + dto.Thumbnail.FileName);
            }

            blog.Title = dto.Title;
            blog.Content = dto.Content;
            blog.Category = dto.Category;

            if (dto.Thumbnail != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "blogs");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                string fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Thumbnail.FileName)}";
                string filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Thumbnail.CopyToAsync(stream);
                }

                string baseUrl = $"{Request.Scheme}://{Request.Host}";
                blog.ThumbnailUrl = $"{baseUrl}/uploads/blogs/{fileName}";
                Console.WriteLine("UPDATE BLOG: New URL = " + blog.ThumbnailUrl);
            }
            else
            {
                Console.WriteLine("UPDATE BLOG: No new thumbnail provided");
            }

            await _context.SaveChangesAsync();
            return Ok("Blog updated successfully");
        }



        // =========================
        // DELETE OWN BLOG (USER)
        // =========================
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            int userId = UserContextHelper.GetUserId(User);

            var blog = await _context.Blogs.FindAsync(id);

            if (blog == null)
                return NotFound("Blog not found");

            if (blog.UserId != userId)
                return Forbid("You can delete only your own blog");

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();

            return Ok("Blog deleted successfully");
        }

        // =========================
        // CATEGORY-WISE BLOGS
        // =========================
        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetBlogsByCategory(string category)
        {
            var blogs = await _context.Blogs
                .Include(b => b.Author)
                .Where(b => b.Category == category)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Category,
                    b.ThumbnailUrl,          // ✅ NEW
                    b.CreatedAt,
                    Author = b.Author.Username
                })
                .ToListAsync();

            return Ok(blogs);
        }

        // =========================
        // TRENDING BLOGS
        // =========================
        [HttpGet("trending")]
        public async Task<IActionResult> GetTrendingBlogs()
        {
            var blogs = await _context.Blogs
                .Include(b => b.Author)
                .OrderByDescending(b => b.LikesCount)
                .Take(5)
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Category,
                    b.ThumbnailUrl,          // ✅ NEW
                    b.LikesCount,
                    Author = b.Author.Username
                })
                .ToListAsync();

            return Ok(blogs);
        }

        // =========================
        // LIKE BLOG (USER)
        // =========================
        [Authorize]
        [HttpPost("{id}/like")]
        public async Task<IActionResult> LikeBlog(int id)
        {
            int userId = UserContextHelper.GetUserId(User);

            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
                return NotFound("Blog not found");

            bool alreadyLiked = await _context.BlogLikes
                .AnyAsync(bl => bl.BlogId == id && bl.UserId == userId);

            if (alreadyLiked)
                return BadRequest("You already liked this blog");

            var like = new BlogLike
            {
                BlogId = id,
                UserId = userId
            };

            _context.BlogLikes.Add(like);
            blog.LikesCount += 1;

            await _context.SaveChangesAsync();

            return Ok("Blog liked");
        }

        // =========================
        // ADMIN DELETE ANY BLOG
        // =========================
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("admin/{id}")]
        public async Task<IActionResult> AdminDeleteBlog(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);

            if (blog == null)
                return NotFound("Blog not found");

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();

            return Ok("Blog deleted by admin");
        }

        // =========================
        // SEARCH BLOGS BY AUTHOR
        // =========================
        [HttpGet("search/{authorName}")]
        public async Task<IActionResult> SearchByAuthor(string authorName)
        {
            var blogs = await _context.Blogs
                .Include(b => b.Author)
                .Where(b => b.Author.Username.Contains(authorName))
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Category,
                    b.ThumbnailUrl,          // ✅ NEW
                    b.CreatedAt,
                    Author = b.Author.Username
                })
                .ToListAsync();

            return Ok(blogs);
        }

        // =========================
        // GET BLOGS BY AUTHOR ID (PUBLIC)
        // =========================
        [HttpGet("author/{userId}")]
        public async Task<IActionResult> GetBlogsByAuthor(int userId)
        {
            var blogs = await _context.Blogs
                .Include(b => b.Author)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Category,
                    b.ThumbnailUrl,
                    b.LikesCount,
                    b.CreatedAt,
                    Author = b.Author.Username
                })
                .ToListAsync();

            if (!blogs.Any())
                return NotFound("No blogs found for this author");

            return Ok(blogs);
        }

    }
}
