using Jerome.Api.DTOs.Prophet;
using Jerome.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jerome.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProphetController : ControllerBase
{
    private readonly IProphetService _service;

    public ProphetController(IProphetService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAll());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var prophet = await _service.GetById(id);

        if (prophet == null)
            return NotFound();

        return Ok(prophet);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateProphetDto dto)
    {
        return Ok(await _service.Create(dto));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromForm] UpdateProphetDto dto)
    {
        var prophet = await _service.Update(id, dto);

        if (prophet == null)
            return NotFound();

        return Ok(prophet);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool ok = await _service.Delete(id);

        if (!ok)
            return NotFound();

        return Ok();
    }
}