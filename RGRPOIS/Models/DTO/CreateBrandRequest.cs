namespace RGRPOIS.Models.DTO;

public class CreateBrandRequest
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string ExternalLogoId { get; set; } = null!;
}
