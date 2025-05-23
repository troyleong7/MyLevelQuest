using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MyLevelQuest.API.Models
{
    public class UserModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string Username { get; set; }  // Display name

        [Required, EmailAddress]
        public required string Email { get; set; }     // Used for login

        [Required]
        [JsonIgnore]
        public required string PasswordHash { get; set; }

        public int ExperiencePoints { get; set; } = 0;
        public int Level { get; set; } = 1;
    
    }
}