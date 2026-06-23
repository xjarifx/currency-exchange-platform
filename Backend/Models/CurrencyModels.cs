namespace CurrencyExchange.Api.Models;

public class CurrencyConversionRequest
{
    public string SourceCurrency { get; set; } = string.Empty;
    public string TargetCurrency { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}

public class CurrencyConversionResponse
{
    public string SourceCurrency { get; set; } = string.Empty;
    public string TargetCurrency { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal ConvertedAmount { get; set; }
    public decimal Rate { get; set; }
    public DateTime Timestamp { get; set; }
}

public class SupportedCurrenciesResponse
{
    public List<CurrencyInfo> Currencies { get; set; } = new();
}

public class CurrencyInfo
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
