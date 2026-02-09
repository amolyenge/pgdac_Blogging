using BloggingApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BloggingApp.API.Controllers
{
    [ApiController]
    [Route("api/ai")]
    [Authorize]
    public class AiController : ControllerBase
    {
        private readonly LanguageToolService _aiService;

        public AiController(LanguageToolService aiService)
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
