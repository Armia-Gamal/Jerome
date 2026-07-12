using Jerome.Api.DTOs.Auth;

namespace Jerome.Api.Services.Interfaces;

public interface IAuthService
{
    Task<object> Register(RegisterDto dto);

    Task<object?> Login(LoginDto dto);
}