using Jerome.Api.DTOs.Choice;

namespace Jerome.Api.DTOs.Question;

public class UpdateQuestionDto
{
    public string QuestionText { get; set; } = string.Empty;

    public int Order { get; set; }

    public List<CreateChoiceDto> Choices { get; set; } = [];
}