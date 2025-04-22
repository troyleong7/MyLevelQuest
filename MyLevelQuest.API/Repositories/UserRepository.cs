using Microsoft.EntityFrameworkCore;
using MyLevelQuest.API.Data;
using MyLevelQuest.API.Models;

namespace MyLevelQuest.API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserModel> AddUserAsync(UserModel user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<UserModel?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<UserModel?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

    }
}