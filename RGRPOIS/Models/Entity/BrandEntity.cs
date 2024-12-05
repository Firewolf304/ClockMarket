using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RGRPOIS.Helpers.Utils;

namespace RGRPOIS.Helpers.Models;

[Table("Brands")]
public class BrandEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [RegularExpression(
        ValidationUtils.AllowedRegex,
        ErrorMessage = ValidationUtils.AllowedRegexMessage
    )]
    public string Name { get; set; } = null!;

    [Required]
    [MaxLength(500)]
    [RegularExpression(
        ValidationUtils.AllowedRegex,
        ErrorMessage = ValidationUtils.AllowedRegexMessage
    )]
    public string Description { get; set; } = null!;

    public string ExternalLogoId { get; set; } = null!;

    public IEnumerable<ProductEntity>? Products { get; set; }
}
