using Microsoft.AspNetCore.Http;

namespace Jerome.Api.Services.Interfaces;

public interface IUploadService
{
    Task<string> UploadImage(IFormFile file);

    Task<string> UploadVideo(IFormFile file);

    void DeleteFile(string path);
}