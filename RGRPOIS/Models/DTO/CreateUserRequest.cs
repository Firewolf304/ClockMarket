namespace RGRPOIS.Models.DTO;

public class CreateUserRequest
{
    public string Firstname { get; set; } = null!;
    public string Lastname { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}