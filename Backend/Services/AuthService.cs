using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CurrencyExchange.Api.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace CurrencyExchange.Api.Services;

public interface IAuthService
{
    LoginResponse? Authenticate(string username, string password);
    UserInfo? GetUserFromToken(string token);
}

public class AuthService : IAuthService
{
    private readonly CredentialsConfig _credentials;
    private readonly JwtSettings _jwtSettings;

    public AuthService(IOptions<CredentialsConfig> credentials, IOptions<JwtSettings> jwtSettings)
    {
        _credentials = credentials.Value;
        _jwtSettings = jwtSettings.Value;
    }

    public LoginResponse? Authenticate(string username, string password)
    {
        var user = _credentials.Users.FirstOrDefault(u =>
            u.Username.Equals(username, StringComparison.OrdinalIgnoreCase) &&
            u.Password == password);

        if (user == null)
            return null;

        var token = GenerateJwtToken(user);
        return new LoginResponse
        {
            Token = token,
            Username = user.Username,
            Email = user.Email,
            Expiration = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes)
        };
    }

    public UserInfo? GetUserFromToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _jwtSettings.Issuer,
                ValidateAudience = true,
                ValidAudience = _jwtSettings.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var username = jwtToken.Claims.First(x => x.Type == ClaimTypes.Name).Value;

            var user = _credentials.Users.FirstOrDefault(u =>
                u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));

            if (user == null)
                return null;

            return new UserInfo
            {
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            };
        }
        catch
        {
            return null;
        }
    }

    private string GenerateJwtToken(UserCredential user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
