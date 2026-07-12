using Jerome.Api.DTOs.Choice;

namespace Jerome.Api.DTOs.Question;

public class CreateQuestionDto
{
    public int ProphetId { get; set; }

    public string QuestionText { get; set; } = string.Empty;

    public int Order { get; set; }

    public List<CreateChoiceDto> Choices { get; set; } = [];
}