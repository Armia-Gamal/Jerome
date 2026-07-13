using Jerome.Api.Data;
using Jerome.Api.Helpers;
using Jerome.Api.Services.Implementations;
using Jerome.Api.Services.Interfaces;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =======================================================
// Database
// =======================================================

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        });
});

// =======================================================
// Controllers
// =======================================================

builder.Services.AddControllers();

// =======================================================
// Swagger
// =======================================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Jerome API",
        Version = "v1",
        Description = "Christian Learning Platform API"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.\n\nExample: Bearer eyJhbGciOiJIUzI1NiIs...",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            Array.Empty<string>()
        }
    });
});

// =======================================================
// Dependency Injection
// =======================================================

builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUploadService, UploadService>();
builder.Services.AddScoped<IProphetService, ProphetService>();
builder.Services.AddScoped<IQuestionService, QuestionService>();

// =======================================================
// JWT
// =======================================================

var jwt = builder.Configuration.GetSection("Jwt");

var key = Encoding.UTF8.GetBytes(jwt["Key"]!);

builder.Services
.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;

    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwt["Issuer"],
        ValidAudience = jwt["Audience"],

        IssuerSigningKey = new SymmetricSecurityKey(key),

        ClockSkew = TimeSpan.Zero
    };
});

// =======================================================
// Authorization
// =======================================================

builder.Services.AddAuthorization();

// =======================================================
// CORS
// =======================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("React", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// =======================================================
// Build
// =======================================================

var app = builder.Build();

// =======================================================
// Create Database Automatically
// =======================================================

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    try
    {
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database Migration Error: {ex.Message}");
    }
}

// =======================================================
// Create wwwroot Automatically
// =======================================================

var webRoot = app.Environment.WebRootPath;

if (string.IsNullOrEmpty(webRoot))
{
    webRoot = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
}

Directory.CreateDirectory(webRoot);
Directory.CreateDirectory(Path.Combine(webRoot, "Uploads"));
Directory.CreateDirectory(Path.Combine(webRoot, "Uploads", "Images"));
Directory.CreateDirectory(Path.Combine(webRoot, "Uploads", "Videos"));

// =======================================================
// Middleware
// =======================================================

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors("React");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();