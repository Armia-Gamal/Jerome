using Jerome.Api.DTOs.Question;
using Jerome.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jerome.Api.Controllers;

[ApiController]

[Route("api/[controller]")]

public class QuestionController : ControllerBase
{
    private readonly IQuestionService _service;

    public QuestionController(IQuestionService service)
    {
        _service = service;
    }

    [HttpGet("{prophetId}")]
    public async Task<IActionResult> Get(int prophetId)
    {
        return Ok(await _service.GetByProphet(prophetId));
    }

    [Authorize(Roles = "Admin")]

    [HttpPost]

    public async Task<IActionResult> Create(CreateQuestionDto dto)
    {
        return Ok(await _service.Create(dto));
    }

    [Authorize(Roles = "Admin")]

    [HttpPut("{id}")]

    public async Task<IActionResult> Update(int id, UpdateQuestionDto dto)
    {
        var result = await _service.Update(id, dto);

        if (result == null)
            return NotFound();

        return Ok(result);
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