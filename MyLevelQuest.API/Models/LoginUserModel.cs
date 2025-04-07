using System.ComponentModel.DataAnnotations;

public class LoginUserModel
{

    [Required, EmailAddress]
    public required string Email { get; set; }

    [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
    public required string Password { get; set; }

}
