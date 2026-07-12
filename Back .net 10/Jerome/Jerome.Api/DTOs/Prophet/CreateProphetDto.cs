using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Jerome.Api.DTOs.Prophet;

public class CreateProphetDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string BibleReference { get; set; } = string.Empty;

    public int Duration { get; set; }

    public IFormFile? Image { get; set; }

    public IFormFile? Video { get; set; }
}