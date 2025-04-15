using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Services;
using System.Net.Http;
using System.Text.RegularExpressions;

namespace Scraper.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ScraperController : ControllerBase
    {
        private readonly ILogger<ScraperController> _logger;
        private readonly HttpClient _httpClient;

        public ScraperController(ILogger<ScraperController> logger)
        {
            _logger = logger;
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36");

        }

        [HttpGet(Name = "GetScrapeWebsite")]
        public async Task<Result> Get([FromQuery] string keyword, [FromQuery] string url)
        {
            List<int> result = new List<int>();

            try
            {
                _logger.LogInformation($"Scraping website: {url}");
                var response = await _httpClient.GetStringAsync(url);

                Regex urlRegex = new Regex(@"href=""(http(?![^""]*google)[^""]+)""", RegexOptions.Compiled); 
                MatchCollection matches = urlRegex.Matches(response);

                for (int i = 0; i < matches.Count; i++)
                {
                    var href = matches[i].Groups[1].Value;
                    if (href.Contains(keyword))
                    {
                        result.Add(i + 1);
                    }
                }

                if (result.Count == 0)
                {
                    return new Result { urlCount = "0" };
                }
                else
                {
                    return new Result { urlCount = string.Join(",", result) };
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while scraping the website.");
                return new Result { urlCount = "0" };
            }
        }
    }
}
