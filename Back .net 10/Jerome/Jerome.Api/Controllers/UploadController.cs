using Jerome.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jerome.Api.Controllers;

[ApiController]

[Route("api/[controller]")]

public class UploadController : ControllerBase
{
    private readonly IUploadService _service;

    public UploadController(IUploadService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null)
            return BadRequest();

        var path =
            await _service.UploadImage(file);

        return Ok(new
        {
            Url = path
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("video")]
    public async Task<IActionResult> UploadVideo(IFormFile file)
    {
        if (file == null)
            return BadRequest();

        var path =
            await _service.UploadVideo(file);

        return Ok(new
        {
            Url = path
        });
    }
}