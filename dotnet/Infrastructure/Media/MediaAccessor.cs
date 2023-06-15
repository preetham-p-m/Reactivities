using Application.Interface;
using Application.Media;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Media;

public class MediaAccessor : IMediaAccessor
{
    private readonly Cloudinary _cloudinary;

    public MediaAccessor(IOptions<CloudinarySettings> config)
    {
        var account = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );

        _cloudinary = new Cloudinary(account);
    }

    public async Task<MediaUploadResult> AddPhoto(IFormFile file)
    {
        if (file.Length <= 0)
        {
            return null;
        }

        await using var stream = file.OpenReadStream();
        var imageUploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Transformation = new Transformation().Height(500).Width(500).Crop("fill")
        };

        var uploadResult = await _cloudinary.UploadAsync(imageUploadParams);

        if (uploadResult.Error != null)
        {
            throw new Exception(uploadResult.Error.Message);
        }

        return new MediaUploadResult
        {
            PublicId = uploadResult.PublicId,
            Url = uploadResult.SecureUrl.ToString()
        };
    }

    public async Task<string> DeletePhoto(string publicId)
    {
        var deleteParmas = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deleteParmas);

        return result.Result == "ok" ? result.Result : null;
    }
}
