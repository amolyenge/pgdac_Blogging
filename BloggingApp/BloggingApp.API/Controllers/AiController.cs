using BloggingApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BloggingApp.API.Controllers
{
    [ApiController]
    [Route("api/ai")]
    [Authorize] // only logged-in users
    public class AiController : ControllerBase
    {
        private readonly GeminiAiService _aiService;

        public AiController(GeminiAiService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("grammar-check")]
        public async Task<IActionResult> GrammarCheck([FromBody] GrammarRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
                return BadRequest("Text is required");

            var corrected = await _aiService.CorrectGrammar(request.Text);
            return Ok(new { correctedText = corrected });
        }
    }

    public class GrammarRequest
    {
        public string Text { get; set; }
    }
}
