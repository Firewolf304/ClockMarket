﻿using System.ComponentModel.DataAnnotations;

namespace RGRPOIS.Models.DTO;

public class ProductFilterRequest
{
    public string? Name { get; set; }
    public int? BrandId { get; set; }
    public int? MinPrice { get; set; }
    public int? MaxPrice { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Count must be greater than 0.")]
    [Required]
    public int Count { get; set; }
    [Range(0, int.MaxValue, ErrorMessage = "Offset must be greater than 0.")]
    [Required]
    public int Offset { get; set; }
}
