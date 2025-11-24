using System.ComponentModel.DataAnnotations;

public class ForgotPasswordRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
}

public class ResetPasswordRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Token { get; set; }

    [Required]
    [MinLength(6)]  // ou conforme sua política
    public string NewPassword { get; set; }
}

