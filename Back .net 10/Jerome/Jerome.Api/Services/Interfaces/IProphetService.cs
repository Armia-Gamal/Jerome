using Jerome.Api.DTOs.Prophet;

namespace Jerome.Api.Services.Interfaces;

public interface IProphetService
{
    Task<List<ProphetDto>> GetAll();

    Task<ProphetDto?> GetById(int id);

    Task<ProphetDto> Create(CreateProphetDto dto);

    Task<ProphetDto?> Update(int id, UpdateProphetDto dto);

    Task<bool> Delete(int id);
}