using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Text.Json.Serialization;
using RGRPOIS.Helpers.Utils;
namespace RGRPOIS.Helpers.Models;

[Table("Users")]
public class UserEntity
{
    [Key] public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [RegularExpression(
        ValidationUtils.AllowedRegex,
        ErrorMessage = ValidationUtils.AllowedRegexMessage
    )]
    public string Firstname { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    [RegularExpression(
        ValidationUtils.AllowedRegex,
        ErrorMessage = ValidationUtils.AllowedRegexMessage
    )]
    public string Lastname { get; set; } = null!;

    [Phone] public string? PhoneNumber { get; set; }

    [Required]
    [MaxLength(50)]
    [RegularExpression(
        ValidationUtils.AllowedRegex,
        ErrorMessage = ValidationUtils.AllowedRegexMessage
    )]
    public string Username { get; set; } = null!;

    [Required] public Role Role { get; set; } = Role.Customer;

    [JsonIgnore][Required] public string PasswordHash { get; set; } = null!;
    public IEnumerable<OrderEntity>? Orders { get; set; } = null!;

}
