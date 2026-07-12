using System.ComponentModel.DataAnnotations;

namespace Jerome.Api.Entities;

public class Choice
{
    public int Id { get; set; }

    public int QuestionId { get; set; }

    [Required]
    public string ChoiceText { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }


    public Question? Question { get; set; }
}