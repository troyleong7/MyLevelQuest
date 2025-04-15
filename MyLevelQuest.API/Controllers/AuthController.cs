using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyLevelQuest.API.Models;
using MyLevelQuest.API.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using MyLevelQuest.API.Settings;
using Microsoft.Extensions.Options;

namespace MyLevelQuest.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IConfiguration _configuration;
        private readonly JwtSettings _jwtSettings;

        public AuthController(IUserRepository userRepo, IConfiguration configuration, IOptions<JwtSettings> jwtSettings)
        {
            _userRepo = userRepo;
            _configuration = configuration;
            _jwtSettings = jwtSettings.Value;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserModel dto)
        {
            var existingUser = await _userRepo.GetUserByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest("User already exists.");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var newUser = new UserModel
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = passwordHash
            };

            var addedUser = await _userRepo.AddUserAsync(newUser);
            return Ok(new { addedUser.Id, addedUser.Email, addedUser.Username });
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserModel dto)
        {
            var user = await _userRepo.GetUserByEmailAsync(dto.Email);
            if (user == null) return Unauthorized("User not found.");

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!isPasswordValid) return Unauthorized("Invalid credentials.");

            string token = GenerateJwtToken(user);

            return Ok(new {user.Username, token });
        }

        private string GenerateJwtToken(UserModel user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username)
            };
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
