using Jerome.Api.Services.Interfaces;

namespace Jerome.Api.Services.Implementations;

public class UploadService : IUploadService
{
    private readonly IWebHostEnvironment _environment;

    public UploadService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> UploadImage(IFormFile file)
    {
        return await Upload(file, "Images");
    }

    public async Task<string> UploadVideo(IFormFile file)
    {
        return await Upload(file, "Videos");
    }

    private async Task<string> Upload(IFormFile file, string folder)
    {
        var uploadFolder = Path.Combine(
            _environment.WebRootPath,
            "Uploads",
            folder);

        if (!Directory.Exists(uploadFolder))
            Directory.CreateDirectory(uploadFolder);

        var fileName =
            Guid.NewGuid().ToString() +
            Path.GetExtension(file.FileName);

        var filePath =
            Path.Combine(uploadFolder, fileName);

        using var stream =
            new FileStream(filePath, FileMode.Create);

        await file.CopyToAsync(stream);

        return $"/Uploads/{folder}/{fileName}";
    }

    public void DeleteFile(string path)
    {
        if (string.IsNullOrEmpty(path))
            return;

        var full =
            Path.Combine(
                _environment.WebRootPath,
                path.TrimStart('/'));

        if (File.Exists(full))
            File.Delete(full);
    }
}