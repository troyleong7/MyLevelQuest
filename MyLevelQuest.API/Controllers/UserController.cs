using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLevelQuest.API.Repositories;
using System.Security.Claims;

namespace MyLevelQuest.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Requires valid JWT
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepo;

        public UserController(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized("Invalid token.");

            if (!int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized("Invalid user ID.");

            var user = await _userRepo.GetUserByIdAsync(userId);

            if (user == null)
                return NotFound("User not found.");

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Level,
                user.ExperiencePoints
            });
        }
    }
}