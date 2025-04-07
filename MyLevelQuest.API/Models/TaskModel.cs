using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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
        [JsonConverter(typeof(JsonStringEnumConverter))] // Converts string values to enum automatically
        public TaskType Type { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Default to now
        
        [Required]
        public int UserId { get; set; } // Foreign key

        [ForeignKey("UserId")]
        public UserModel? User { get; set; }
    }
}