using CurrencyExchange.Api.Models;
using CurrencyExchange.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CurrencyExchange.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(ApiResponse<LoginResponse>.Fail("Username and password are required."));

        var response = _authService.Authenticate(request.Username, request.Password);

        if (response == null)
            return Unauthorized(ApiResponse<LoginResponse>.Fail("Invalid username or password."));

        return Ok(ApiResponse<LoginResponse>.Ok(response, "Login successful."));
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        var token = Request.Headers.Authorization.ToString().Replace("Bearer ", "");
        var user = _authService.GetUserFromToken(token);

        if (user == null)
            return Unauthorized(ApiResponse<UserInfo>.Fail("Invalid token."));

        return Ok(ApiResponse<UserInfo>.Ok(user));
    }

    [HttpGet("validate")]
    public IActionResult ValidateToken()
    {
        var authHeader = Request.Headers.Authorization.ToString();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            return Unauthorized(new { valid = false });

        var token = authHeader.Substring("Bearer ".Length);
        var user = _authService.GetUserFromToken(token);

        return user != null
            ? Ok(new { valid = true })
            : Unauthorized(new { valid = false });
    }
}
