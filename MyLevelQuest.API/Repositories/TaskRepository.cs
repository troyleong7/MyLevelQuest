using Microsoft.EntityFrameworkCore;
using MyLevelQuest.API.Data;
using MyLevelQuest.API.Models;

namespace MyLevelQuest.API.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly AppDbContext _context;

        public TaskRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskModel>> GetAllTasksAsync(int userId)
        {
            return await _context.Tasks
                .Where(t => t.UserId == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskModel>> GetTasksByUserIdAsync(int userId)
        {
            return await _context.Tasks
                .Where(t => t.UserId == userId)
                .ToListAsync();
        }

        public async Task<TaskModel?> GetTaskByTitleAsync(string title, int userId)
        {
            return await _context.Tasks
                .FirstOrDefaultAsync(t => t.Title.ToLower() == title.ToLower() && t.UserId == userId);
        }

        public async Task<TaskModel> AddTaskAsync(TaskModel task, int userId)
        {
            task.UserId = userId;
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<TaskModel?> UpdateTaskAsync(TaskModel task, int userId)
        {
            var existingTask = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == task.Id && t.UserId == userId);
            if (existingTask == null) return null;

            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.IsCompleted = task.IsCompleted;
            existingTask.Type = task.Type;

            await _context.SaveChangesAsync();
            return existingTask;
        }

        public async Task<bool> DeleteTaskAsync(int id, int userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<TaskModel>> GetTasksByTypeAsync(TaskType type, int userId)
        {
            return await _context.Tasks
                .Where(t => t.Type == type && t.UserId == userId)
                .ToListAsync();
        }
    }
}