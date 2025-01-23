using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RGRPOIS.Helpers.Utils;

namespace RGRPOIS.Helpers.Models;

[Table("Products")]
public class ProductEntity
{
    [Key] public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [RegularExpression(
        ValidationUtils.AllowedTextRegex,
        ErrorMessage = ValidationUtils.AllowedRegexMessage
    )]
    public string Name { get; set; } = null!;

    [MaxLength(50)]
    public string Country { get; set; } = null!;

    /// <summary>
    ///   Price in kopecks
    /// </summary>
    [Required]
    [Range(0, int.MaxValue)]
    public int Price { get; set; }

    public Sex Gender { get; set; }

    

    [Range(0, int.MaxValue)]
    public int Waterproof { get; set; } = 0;


    [Required]
    [MaxLength(500)]
    [RegularExpression(
        ValidationUtils.AllowedTextRegex,
        ErrorMessage = ValidationUtils.AllowedRegexMessage
    )]
    public string Description { get; set; } = null!;

    [Required] public List<string> ImagesURLs { get; set; } = new();

    [Required] public int BrandId { get; set; }
    public BrandEntity? Brand { get; set; } = null!;

    public IEnumerable<ModelEntity>? Models { get; set; } = null!;
}
