using MyLevelQuest.API.Models;

namespace MyLevelQuest.API.Repositories
{
    public interface ITaskRepository
    {
        Task<IEnumerable<TaskModel>> GetAllTasksAsync();
        Task<IEnumerable<TaskModel>> GetTasksByUserIdAsync(int userId);
        Task<TaskModel?> GetTaskByTitleAsync(string title, int userId);
        Task<TaskModel> AddTaskAsync(TaskModel task, int userId);
        Task<TaskModel?> UpdateTaskAsync(TaskModel task, int userId);
        Task<bool> DeleteTaskAsync(int id, int userId);
        Task<IEnumerable<TaskModel>> GetTasksByTypeAsync(TaskType type, int userId);
    }
}
