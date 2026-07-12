using Jerome.Api.DTOs.Question;

namespace Jerome.Api.Services.Interfaces;

public interface IQuestionService
{
    Task<List<QuestionDto>> GetByProphet(int prophetId);

    Task<QuestionDto> Create(CreateQuestionDto dto);

    Task<QuestionDto?> Update(int id, UpdateQuestionDto dto);

    Task<bool> Delete(int id);
}