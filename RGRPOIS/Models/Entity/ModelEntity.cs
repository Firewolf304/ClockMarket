﻿using System.ComponentModel.DataAnnotations;

namespace RGRPOIS.Helpers.Models;

public class ModelEntity
{
    [Key] public int Id { get; set; }

    [Required]
    public int ShoeId { get; set; }
    public ProductEntity? Product { get; set; } = null!;

    [Required]
    public int Quantity { get; set; } = 0;

    public IEnumerable<OrderItemEntity> OrderItems { get; set; } = null!;
}
