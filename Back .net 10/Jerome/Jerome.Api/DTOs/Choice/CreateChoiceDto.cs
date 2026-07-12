namespace Jerome.Api.DTOs.Choice;

public class CreateChoiceDto
{
    public string ChoiceText { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }
}