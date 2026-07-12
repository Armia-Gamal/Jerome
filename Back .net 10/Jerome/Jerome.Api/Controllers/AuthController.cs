using Jerome.Api.DTOs.Auth;
using Jerome.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Jerome.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;

    public AuthController(IAuthService service)
    {
        _service = service;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _service.Register(dto);

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _service.Login(dto);

        if (result == null)
            return Unauthorized("Invalid Email or Password");

        return Ok(result);
    }
}