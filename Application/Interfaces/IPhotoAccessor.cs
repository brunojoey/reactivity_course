using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        // Two methods: Add Photo, Delete Photo
        PhotoUploadResult AddPhoto(IFormFile file);
        string DeletePhoto(string publicId);
    };
};