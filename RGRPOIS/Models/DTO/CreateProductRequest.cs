using RGRPOIS.Helpers.Models;

namespace RGRPOIS.Models.DTO;

public class CreateProductRequest
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Barcode { get; set; } = null!;
    public int BrandId { get; set; }
    public int Price { get; set; }

    // model to quantity mapping
    public Dictionary<string, int> Models { get; set; } = null!;
}
