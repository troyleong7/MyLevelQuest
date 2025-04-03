using System.ComponentModel.DataAnnotations;

namespace MyLevelQuest.API.Models
{
    public enum TaskType
    {
        Side,
        Daily,
        Weekly,
        Monthly,
        Yearly
    }

    public class TaskModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string Title { get; set; }

        public string? Description { get; set; }

        public bool IsCompleted { get; set; } = false; // Default to false

        [Required]
        public TaskType Type { get; set; } = TaskType.Side;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Default to now
        
    }
}