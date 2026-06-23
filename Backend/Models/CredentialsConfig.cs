namespace CurrencyExchange.Api.Models;

public class CredentialsConfig
{
    public List<UserCredential> Users { get; set; } = new();
}

public class UserCredential
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
}
