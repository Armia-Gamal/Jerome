using System.ComponentModel.DataAnnotations;

namespace Jerome.Api.Entities;

public class Question
{
    public int Id { get; set; }

    public int ProphetId { get; set; }

    [Required]
    public string QuestionText { get; set; } = string.Empty;

    public int Order { get; set; }


    public Prophet? Prophet { get; set; }

    public ICollection<Choice> Choices { get; set; }
        = new List<Choice>();
}