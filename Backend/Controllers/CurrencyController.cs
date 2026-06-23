using CurrencyExchange.Api.Models;
using CurrencyExchange.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CurrencyExchange.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CurrencyController : ControllerBase
{
    private readonly ICurrencyService _currencyService;

    public CurrencyController(ICurrencyService currencyService)
    {
        _currencyService = currencyService;
    }

    [HttpGet("currencies")]
    public async Task<IActionResult> GetCurrencies()
    {
        try
        {
            var currencies = await _currencyService.GetSupportedCurrenciesAsync();
            return Ok(ApiResponse<List<CurrencyInfo>>.Ok(currencies));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<List<CurrencyInfo>>.Fail($"Error fetching currencies: {ex.Message}"));
        }
    }

    [HttpPost("convert")]
    public async Task<IActionResult> Convert([FromBody] CurrencyConversionRequest request)
    {
        if (request.Amount <= 0)
            return BadRequest(ApiResponse<CurrencyConversionResponse>.Fail("Amount must be greater than zero."));

        if (string.IsNullOrWhiteSpace(request.SourceCurrency) || string.IsNullOrWhiteSpace(request.TargetCurrency))
            return BadRequest(ApiResponse<CurrencyConversionResponse>.Fail("Source and target currencies are required."));

        if (request.SourceCurrency.Length != 3 || request.TargetCurrency.Length != 3)
            return BadRequest(ApiResponse<CurrencyConversionResponse>.Fail("Currency codes must be 3 characters."));

        try
        {
            var result = await _currencyService.ConvertAsync(request);

            if (result == null)
                return NotFound(ApiResponse<CurrencyConversionResponse>.Fail("One or both currencies are not supported."));

            return Ok(ApiResponse<CurrencyConversionResponse>.Ok(result));
        }
        catch (CurrencyApiException ex)
        {
            return StatusCode(502, ApiResponse<CurrencyConversionResponse>.Fail(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<CurrencyConversionResponse>.Fail($"Conversion error: {ex.Message}"));
        }
    }
}
