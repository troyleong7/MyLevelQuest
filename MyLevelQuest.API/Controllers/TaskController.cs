using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLevelQuest.API.Models;
using MyLevelQuest.API.Repositories;

namespace MyLevelQuest.API.Controllers
{   
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskRepository _taskRepository;

        public TaskController(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        // GET: api/task
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _taskRepository.GetAllTasksAsync();
            return Ok(tasks);
        }

        // GET: api/task/title/{title}
        [HttpGet("title/{title}")]
        public async Task<IActionResult> GetTaskByTitle(string title)
        {
            int userId = GetAuthenticatedUserId();
            var task = await _taskRepository.GetTaskByTitleAsync(title, userId);
            if (task == null) return NotFound();
            return Ok(task);
        }
        
        // GET: api/task/user
        [HttpGet("user")]
        public async Task<IActionResult> GetTasksByUser()
        {
            int userId = GetAuthenticatedUserId();
            var tasks = await _taskRepository.GetTasksByUserIdAsync(userId);
            return Ok(tasks);
        }

       // POST: api/task
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskModel task)
        {
            int userId = GetAuthenticatedUserId();
            task.UserId = userId;

            var createdTask = await _taskRepository.AddTaskAsync(task, userId);
            return CreatedAtAction(nameof(GetTaskByTitle), new { title = task.Title }, createdTask);
        }

         // PUT: api/task/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskModel task)
        {
            if (task == null || id != task.Id) return BadRequest("Invalid task data");

            int userId = GetAuthenticatedUserId();
            var updatedTask = await _taskRepository.UpdateTaskAsync(task, userId);
            if (updatedTask == null) return NotFound();

            return Ok(updatedTask);
        }

         // DELETE: api/task/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            int userId = GetAuthenticatedUserId();
            var deleted = await _taskRepository.DeleteTaskAsync(id, userId);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // GET: api/task/type/{type}
        [HttpGet("type/{type}")]
        public async Task<IActionResult> GetTasksByType(TaskType type)
        {
            int userId = GetAuthenticatedUserId();
            var tasks = await _taskRepository.GetTasksByTypeAsync(type, userId);
            return Ok(tasks);
        }
         private int GetAuthenticatedUserId()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdString, out int userId))
                return userId;

            throw new InvalidOperationException("User ID is not available or invalid.");
        }

    }
}