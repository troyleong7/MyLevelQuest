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

        public async Task<IEnumerable<TaskModel>> GetAllTasksAsync()
        {
            return await _context.Tasks.ToListAsync(); // Fetch all tasks
        }

        public async Task<TaskModel?> GetTaskByIdAsync(int id)
        {
            return await _context.Tasks.FindAsync(id); // Find a task by ID
        }

        public async Task<TaskModel> AddTaskAsync(TaskModel task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync(); // Save to database
            return task;
        }

        public async Task<TaskModel?> UpdateTaskAsync(TaskModel task)
        {
            var existingTask = await _context.Tasks.FindAsync(task.Id);
            if (existingTask == null) return null;

            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.IsCompleted = task.IsCompleted;

            await _context.SaveChangesAsync();
            return existingTask;
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<TaskModel>> GetTasksByTypeAsync(TaskType type)
        {
            return await _context.Tasks.Where(t => t.Type == type).ToListAsync();
        }
    }
}