using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BloggingApp.API.Controllers
{
    [ApiController]
    [Route("api/admin-test")]
    public class AdminTestController : ControllerBase
    {
        [Authorize(Roles = "ADMIN")]
        [HttpGet("only-admin")]
        public IActionResult OnlyAdmin()
        {
            return Ok("Admin access confirmed");
        }
    }
}
