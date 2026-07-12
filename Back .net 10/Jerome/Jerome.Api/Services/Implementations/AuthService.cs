using BCrypt.Net;
using Jerome.Api.Data;
using Jerome.Api.DTOs.Auth;
using Jerome.Api.Entities;
using Jerome.Api.Helpers;
using Jerome.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Jerome.Api.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;

    private readonly JwtHelper _jwt;

    public AuthService(
        ApplicationDbContext context,
        JwtHelper jwt)
    {
        _context = context;
        _jwt = jwt;
    }

    public async Task<object> Register(RegisterDto dto)
    {
        var exists =
            await _context.Users.AnyAsync(x => x.Email == dto.Email);

        if (exists)
            throw new Exception("Email already exists.");

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "Student"
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        var token = _jwt.GenerateToken(user);

        return new
        {
            user.Id,
            user.FullName,
            user.Email,
            user.Role,
            Token = token
        };
    }

    public async Task<object?> Login(LoginDto dto)
    {
        var user =
            await _context.Users
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        if (user == null)
            return null;

        bool ok =
            BCrypt.Net.BCrypt.Verify(
                dto.Password,
                user.PasswordHash
            );

        if (!ok)
            return null;

        var token =
            _jwt.GenerateToken(user);

        return new
        {
            user.Id,
            user.FullName,
            user.Email,
            user.Role,
            Token = token
        };
    }
}