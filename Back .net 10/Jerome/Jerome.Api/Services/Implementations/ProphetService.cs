using Jerome.Api.Data;
using Jerome.Api.DTOs.Prophet;
using Jerome.Api.Entities;
using Jerome.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Jerome.Api.Services.Implementations;

public class ProphetService : IProphetService
{
    private readonly ApplicationDbContext _context;
    private readonly IUploadService _upload;

    public ProphetService(
        ApplicationDbContext context,
        IUploadService upload)
    {
        _context = context;
        _upload = upload;
    }

    public async Task<List<ProphetDto>> GetAll()
    {
        return await _context.Prophets
            .Select(x => new ProphetDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                ImagePath = x.ImagePath,
                VideoPath = x.VideoPath,
                BibleReference = x.BibleReference,
                Duration = x.Duration
            })
            .ToListAsync();
    }

    public async Task<ProphetDto?> GetById(int id)
    {
        var prophet = await _context.Prophets.FindAsync(id);

        if (prophet == null)
            return null;

        return new ProphetDto
        {
            Id = prophet.Id,
            Name = prophet.Name,
            Description = prophet.Description,
            ImagePath = prophet.ImagePath,
            VideoPath = prophet.VideoPath,
            BibleReference = prophet.BibleReference,
            Duration = prophet.Duration
        };
    }

    public async Task<ProphetDto> Create(CreateProphetDto dto)
    {
        string imagePath = "";
        string videoPath = "";

        if (dto.Image != null)
        {
            imagePath = await _upload.UploadImage(dto.Image);
        }

        if (dto.Video != null)
        {
            videoPath = await _upload.UploadVideo(dto.Video);
        }

        var prophet = new Prophet
        {
            Name = dto.Name,
            Description = dto.Description,
            BibleReference = dto.BibleReference,
            Duration = dto.Duration,
            ImagePath = imagePath,
            VideoPath = videoPath
        };

        _context.Prophets.Add(prophet);

        await _context.SaveChangesAsync();

        return new ProphetDto
        {
            Id = prophet.Id,
            Name = prophet.Name,
            Description = prophet.Description,
            ImagePath = prophet.ImagePath,
            VideoPath = prophet.VideoPath,
            BibleReference = prophet.BibleReference,
            Duration = prophet.Duration
        };
    }

    public async Task<ProphetDto?> Update(int id, UpdateProphetDto dto)
    {
        var prophet = await _context.Prophets.FindAsync(id);

        if (prophet == null)
            return null;

        prophet.Name = dto.Name;
        prophet.Description = dto.Description;
        prophet.BibleReference = dto.BibleReference;
        prophet.Duration = dto.Duration;

        if (dto.Image != null)
        {
            _upload.DeleteFile(prophet.ImagePath);

            prophet.ImagePath =
                await _upload.UploadImage(dto.Image);
        }

        if (dto.Video != null)
        {
            _upload.DeleteFile(prophet.VideoPath);

            prophet.VideoPath =
                await _upload.UploadVideo(dto.Video);
        }

        await _context.SaveChangesAsync();

        return new ProphetDto
        {
            Id = prophet.Id,
            Name = prophet.Name,
            Description = prophet.Description,
            ImagePath = prophet.ImagePath,
            VideoPath = prophet.VideoPath,
            BibleReference = prophet.BibleReference,
            Duration = prophet.Duration
        };
    }

    public async Task<bool> Delete(int id)
    {
        var prophet = await _context.Prophets.FindAsync(id);

        if (prophet == null)
            return false;

        _upload.DeleteFile(prophet.ImagePath);
        _upload.DeleteFile(prophet.VideoPath);

        _context.Prophets.Remove(prophet);

        await _context.SaveChangesAsync();

        return true;
    }
}