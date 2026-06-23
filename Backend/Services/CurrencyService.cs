using System.Net.Http.Json;
using System.Text.Json;
using CurrencyExchange.Api.Models;
using Microsoft.Extensions.Caching.Memory;

namespace CurrencyExchange.Api.Services;

public interface ICurrencyService
{
    Task<CurrencyConversionResponse?> ConvertAsync(CurrencyConversionRequest request);
    Task<List<CurrencyInfo>> GetSupportedCurrenciesAsync();
}

public class CurrencyService : ICurrencyService
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CurrencyService> _logger;
    private const string CacheKeyRates = "exchange_rates";
    private const string CacheKeyCurrencies = "supported_currencies";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(30);

    public CurrencyService(HttpClient httpClient, IMemoryCache cache, ILogger<CurrencyService> logger)
    {
        _httpClient = httpClient;
        _cache = cache;
        _logger = logger;
    }

    public async Task<CurrencyConversionResponse?> ConvertAsync(CurrencyConversionRequest request)
    {
        try
        {
            var rates = await GetExchangeRatesAsync();

            if (!rates.ContainsKey(request.SourceCurrency.ToUpper()))
            {
                _logger.LogWarning("Source currency {Currency} not found", request.SourceCurrency);
                return null;
            }

            if (!rates.ContainsKey(request.TargetCurrency.ToUpper()))
            {
                _logger.LogWarning("Target currency {Currency} not found", request.TargetCurrency);
                return null;
            }

            var sourceRate = rates[request.SourceCurrency.ToUpper()];
            var targetRate = rates[request.TargetCurrency.ToUpper()];
            var rate = targetRate / sourceRate;
            var convertedAmount = Math.Round(request.Amount * rate, 2);

            return new CurrencyConversionResponse
            {
                SourceCurrency = request.SourceCurrency.ToUpper(),
                TargetCurrency = request.TargetCurrency.ToUpper(),
                Amount = request.Amount,
                ConvertedAmount = convertedAmount,
                Rate = Math.Round(rate, 6),
                Timestamp = DateTime.UtcNow
            };
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error fetching exchange rates");
            throw new CurrencyApiException("Unable to fetch exchange rates from the external API.", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during currency conversion");
            throw;
        }
    }

    public async Task<List<CurrencyInfo>> GetSupportedCurrenciesAsync()
    {
        if (_cache.TryGetValue(CacheKeyCurrencies, out List<CurrencyInfo>? cached) && cached != null)
            return cached;

        var rates = await GetExchangeRatesAsync();
        var currencies = rates.Keys
            .OrderBy(c => c)
            .Select(code => new CurrencyInfo
            {
                Code = code,
                Name = GetCurrencyName(code)
            })
            .ToList();

        _cache.Set(CacheKeyCurrencies, currencies, CacheDuration);
        return currencies;
    }

    private async Task<Dictionary<string, decimal>> GetExchangeRatesAsync()
    {
        if (_cache.TryGetValue(CacheKeyRates, out Dictionary<string, decimal>? cached) && cached != null)
            return cached;

        var response = await _httpClient.GetAsync("https://api.exchangerate-api.com/v4/latest/USD");
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var doc = JsonDocument.Parse(json);

        var rates = new Dictionary<string, decimal>();
        if (doc.RootElement.TryGetProperty("rates", out var ratesElement))
        {
            foreach (var property in ratesElement.EnumerateObject())
            {
                rates[property.Name] = property.Value.GetDecimal();
            }
        }

        _cache.Set(CacheKeyRates, rates, CacheDuration);
        return rates;
    }

    private static string GetCurrencyName(string code) => code switch
    {
        "USD" => "US Dollar",
        "EUR" => "Euro",
        "GBP" => "British Pound",
        "JPY" => "Japanese Yen",
        "AUD" => "Australian Dollar",
        "CAD" => "Canadian Dollar",
        "CHF" => "Swiss Franc",
        "CNY" => "Chinese Yuan",
        "INR" => "Indian Rupee",
        "MXN" => "Mexican Peso",
        "BRL" => "Brazilian Real",
        "KRW" => "South Korean Won",
        "SGD" => "Singapore Dollar",
        "HKD" => "Hong Kong Dollar",
        "NOK" => "Norwegian Krone",
        "SEK" => "Swedish Krona",
        "DKK" => "Danish Krone",
        "NZD" => "New Zealand Dollar",
        "ZAR" => "South African Rand",
        "RUB" => "Russian Ruble",
        "TRY" => "Turkish Lira",
        "AED" => "UAE Dirham",
        "SAR" => "Saudi Riyal",
        "THB" => "Thai Baht",
        "PLN" => "Polish Zloty",
        "CZK" => "Czech Koruna",
        "HUF" => "Hungarian Forint",
        "PHP" => "Philippine Peso",
        "IDR" => "Indonesian Rupiah",
        "MYR" => "Malaysian Ringgit",
        "VND" => "Vietnamese Dong",
        "EGP" => "Egyptian Pound",
        "NGN" => "Nigerian Naira",
        "PKR" => "Pakistani Rupee",
        "BDT" => "Bangladeshi Taka",
        "LKR" => "Sri Lankan Rupee",
        _ => code
    };
}

public class CurrencyApiException : Exception
{
    public CurrencyApiException(string message, Exception innerException)
        : base(message, innerException) { }
}
