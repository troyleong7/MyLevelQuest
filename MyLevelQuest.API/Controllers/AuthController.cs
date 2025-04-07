using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyLevelQuest.API.Models;
using MyLevelQuest.API.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace MyLevelQuest.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IConfiguration _configuration;

        public AuthController(IUserRepository userRepo, IConfiguration configuration)
        {
            _userRepo = userRepo;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserModel userDto)
        {
            var existingUser = await _userRepo.GetUserByEmailAsync(userDto.Email);
            if (existingUser != null)
                return BadRequest("User already exists.");

            // Hash the password
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.PasswordHash);

            var newUser = new UserModel
            {
                Username = userDto.Username,
                Email = userDto.Email,
                PasswordHash = passwordHash
            };

            var addedUser = await _userRepo.AddUserAsync(newUser);
            return Ok(new { addedUser.Id, addedUser.Email, addedUser.Username });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserModel loginDto)
        {
            var user = await _userRepo.GetUserByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized("User not found.");

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.PasswordHash, user.PasswordHash);
            if (!isPasswordValid) return Unauthorized("Invalid credentials.");

            string token = GenerateJwtToken(user);

            return Ok(new { token });
        }

        private string GenerateJwtToken(UserModel user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not configured")));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
