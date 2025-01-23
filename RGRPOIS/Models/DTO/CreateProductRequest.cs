using RGRPOIS.Helpers.Models;
using RGRPOIS.Helpers.Utils;

namespace RGRPOIS.Models.DTO;

public class CreateProductRequest
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int BrandId { get; set; }
    public int Price { get; set; }
    public Sex Gender { get; set; }
    public string Country { get; set; } = null!;
    public int Waterproof {  get; set; }
    public List<string> ImageURLS { get; set; }

    // model to quantity mapping
    [AtLeastOneElementDict]
    public Dictionary<string, int> Models { get; set; } = null!;
}
