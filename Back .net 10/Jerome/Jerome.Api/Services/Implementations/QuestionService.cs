using Jerome.Api.Data;
using Jerome.Api.DTOs.Choice;
using Jerome.Api.DTOs.Question;
using Jerome.Api.Entities;
using Jerome.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Jerome.Api.Services.Implementations;

public class QuestionService : IQuestionService
{
    private readonly ApplicationDbContext _context;

    public QuestionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<QuestionDto>> GetByProphet(int prophetId)
    {
        return await _context.Questions

            .Include(x => x.Choices)

            .Where(x => x.ProphetId == prophetId)

            .OrderBy(x => x.Order)

            .Select(x => new QuestionDto
            {
                Id = x.Id,

                QuestionText = x.QuestionText,

                Order = x.Order,

                Choices = x.Choices.Select(c => new CreateChoiceDto
                {
                    ChoiceText = c.ChoiceText,

                    IsCorrect = c.IsCorrect

                }).ToList()

            }).ToListAsync();
    }

    public async Task<QuestionDto> Create(CreateQuestionDto dto)
    {
        var question = new Question
        {
            ProphetId = dto.ProphetId,

            QuestionText = dto.QuestionText,

            Order = dto.Order
        };

        foreach (var item in dto.Choices)
        {
            question.Choices.Add(new Choice
            {
                ChoiceText = item.ChoiceText,

                IsCorrect = item.IsCorrect
            });
        }

        _context.Questions.Add(question);

        await _context.SaveChangesAsync();

        return await Get(question.Id);
    }

    private async Task<QuestionDto> Get(int id)
    {
        var q = await _context.Questions

            .Include(x => x.Choices)

            .FirstAsync(x => x.Id == id);

        return new QuestionDto
        {
            Id = q.Id,

            QuestionText = q.QuestionText,

            Order = q.Order,

            Choices = q.Choices.Select(c => new CreateChoiceDto
            {
                ChoiceText = c.ChoiceText,

                IsCorrect = c.IsCorrect

            }).ToList()
        };
    }

    public async Task<QuestionDto?> Update(int id, UpdateQuestionDto dto)
    {
        var question = await _context.Questions

            .Include(x => x.Choices)

            .FirstOrDefaultAsync(x => x.Id == id);

        if (question == null)
            return null;

        question.QuestionText = dto.QuestionText;

        question.Order = dto.Order;

        _context.Choices.RemoveRange(question.Choices);

        question.Choices.Clear();

        foreach (var item in dto.Choices)
        {
            question.Choices.Add(new Choice
            {
                ChoiceText = item.ChoiceText,

                IsCorrect = item.IsCorrect
            });
        }

        await _context.SaveChangesAsync();

        return await Get(id);
    }

    public async Task<bool> Delete(int id)
    {
        var question = await _context.Questions.FindAsync(id);

        if (question == null)
            return false;

        _context.Questions.Remove(question);

        await _context.SaveChangesAsync();

        return true;
    }
}