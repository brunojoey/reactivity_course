using Domain;

namespace Application.Interfaces
{
    public interface IJwtGenerator
    {
        // Will be our JWT Token
        string CreateToken(AppUser user);
        RefreshToken GenerateRefreshToken();
    }
}