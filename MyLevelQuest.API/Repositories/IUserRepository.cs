using MyLevelQuest.API.Models;

namespace MyLevelQuest.API.Repositories
{
    public interface IUserRepository
    {
        Task<UserModel> AddUserAsync(UserModel user);
        Task<UserModel?> GetUserByEmailAsync(string email);
        Task<UserModel?> GetUserByIdAsync(int id);
    }
}