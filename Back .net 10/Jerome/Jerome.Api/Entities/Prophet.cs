using System.ComponentModel.DataAnnotations;

namespace Jerome.Api.Entities;

public class Prophet
{
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ImagePath { get; set; } = string.Empty;

    public string VideoPath { get; set; } = string.Empty;

    public string BibleReference { get; set; } = string.Empty;

    public int Duration { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    public ICollection<Question> Questions { get; set; }
        = new List<Question>();
}