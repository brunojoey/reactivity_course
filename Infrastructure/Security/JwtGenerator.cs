using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Interfaces;
using Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Security
{
  public class JwtGenerator : IJwtGenerator
  {
     private readonly SymmetricSecurityKey _key; 
    public JwtGenerator(IConfiguration config)
    {
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
    }

    public string CreateToken(AppUser user)
    {
        // Building out the Claim List
        var claims = new List<Claim>
        {
            // Returning just the user name
            new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
        };

        // Signing credentials
        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            // All descriptions of the JWT Token.
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(30), // Token will expire in 30 minutes after use
            SigningCredentials = creds
        };

        // All below to generate and create the token
        var tokenHandler = new JwtSecurityTokenHandler();
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        
        return tokenHandler.WriteToken(token);

    }
  }
}