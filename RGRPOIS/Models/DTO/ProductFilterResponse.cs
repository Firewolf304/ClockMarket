using RGRPOIS.Helpers.Models;

namespace RGRPOIS.Models.DTO;

public class ProductFilterResponse
{
    public IEnumerable<ProductEntity> Products { get; set; }
    public int RemainingPages { get; set; }
    public int TotalPages { get; set; }
    public int TotalItems { get; set; } 
}
