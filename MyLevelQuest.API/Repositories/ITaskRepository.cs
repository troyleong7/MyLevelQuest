using MyLevelQuest.API.Models; 

namespace MyLevelQuest.API.Repositories
{
    public interface ITaskRepository
    {
        Task<IEnumerable<TaskModel>> GetAllTasksAsync();
        Task<TaskModel?> GetTaskByIdAsync(int id);
        Task<TaskModel> AddTaskAsync(TaskModel task);
        Task<TaskModel?> UpdateTaskAsync(TaskModel task);
        Task<bool> DeleteTaskAsync(int id);
        Task<IEnumerable<TaskModel>> GetTasksByTypeAsync(TaskType type);
    }
}