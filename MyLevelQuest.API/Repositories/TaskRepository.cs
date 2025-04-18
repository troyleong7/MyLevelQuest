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
            return await _context.Tasks.ToListAsync();
        }

        public async Task<IEnumerable<TaskModel>> GetTasksByUserIdAsync(int userId)
        {
            var tasks = await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
            var now = DateTime.UtcNow;

            foreach (var task in tasks)
            {
                bool shouldReset = false;

                switch (task.Type)
                {
                    case TaskType.Daily:
                        shouldReset = task.LastUpdated.Date < now.Date;
                        break;
                    case TaskType.Weekly:
                        var lastWeek = System.Globalization.CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(task.LastUpdated, System.Globalization.CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
                        var thisWeek = System.Globalization.CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(now, System.Globalization.CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
                        shouldReset = task.LastUpdated.Year < now.Year || lastWeek < thisWeek;
                        break;
                    case TaskType.Monthly:
                        shouldReset = task.LastUpdated.Month < now.Month || task.LastUpdated.Year < now.Year;
                        break;
                    case TaskType.Yearly:
                        shouldReset = task.LastUpdated.Year < now.Year;
                        break;
                    default:
                        break;
                }

                if (shouldReset && task.IsCompleted)
                {
                    task.IsCompleted = false;
                    task.LastUpdated = now;
                }
            }

            await _context.SaveChangesAsync();
            return tasks;
    
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