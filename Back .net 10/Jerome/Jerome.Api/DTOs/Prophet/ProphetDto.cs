namespace Jerome.Api.DTOs.Prophet;

public class ProphetDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ImagePath { get; set; } = string.Empty;

    public string VideoPath { get; set; } = string.Empty;

    public string BibleReference { get; set; } = string.Empty;

    public int Duration { get; set; }
}