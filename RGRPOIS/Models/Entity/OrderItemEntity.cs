using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RGRPOIS.Helpers.Models;

[Table("OrderItems")]
public class OrderItemEntity
{
    [Key] public int Id { get; set; }

    [Required] public int Quantity { get; set; }

    [Required] public int ModelID { get; set; }
    public ModelEntity? Model { get; set; }

    [Required] public int OrderId { get; set; }
    public OrderEntity? Order { get; set; }
}
