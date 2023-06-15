using Application.Media;
using Microsoft.AspNetCore.Http;

namespace Application.Interface;

public interface IMediaAccessor
{
    Task<MediaUploadResult> AddPhoto(IFormFile formFile);

    Task<string> DeletePhoto(string publicId);
}
