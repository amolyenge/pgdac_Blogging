using System.Text.Json;

namespace BloggingApp.API.Services
{
    public class LanguageToolService
    {
        private readonly HttpClient _httpClient;

        public LanguageToolService()
        {
            _httpClient = new HttpClient();
        }

        public async Task<string> CorrectGrammar(string text)
        {
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("text", text),
                new KeyValuePair<string, string>("language", "en-US")
            });

            var response = await _httpClient.PostAsync(
                "https://api.languagetool.org/v2/check",
                content
            );

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            if (!doc.RootElement.TryGetProperty("matches", out var matches) ||
                matches.GetArrayLength() == 0)
            {
                return text;
            }

            var correctedText = text;

            // IMPORTANT: process from end to avoid index shifting
            foreach (var match in matches.EnumerateArray().Reverse())
            {
                var replacements = match.GetProperty("replacements");
                if (replacements.GetArrayLength() == 0) continue;

                var replacement = replacements[0]
                    .GetProperty("value")
                    .GetString();

                var offset = match.GetProperty("offset").GetInt32();
                var length = match.GetProperty("length").GetInt32();

                correctedText = correctedText.Remove(offset, length)
                                             .Insert(offset, replacement);
            }

            return correctedText;
        }
    }
}
