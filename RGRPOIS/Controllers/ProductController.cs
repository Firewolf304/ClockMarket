using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RGRPOIS.Helpers.Models;
using RGRPOIS.Models.DTO;
using static RGRPOIS.Helpers.Controllers.OrderControler;

namespace RGRPOIS.Helpers.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductController : Controller
{
    private readonly ILogger<UserController> _logger;
    private readonly AppDBContext _dbContext;

    public ProductController(ILogger<UserController> logger,
        AppDBContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    [Authorization.Authorize(Role.Salesman)]
    [HttpPost(Name = "CreateProduct")]
    public ProductEntity Create([FromBody] CreateProductRequest req )
    {
        var product = new ProductEntity
        {
            Name = req.Name,
            Description = req.Description,
            BrandId = req.BrandId,
            Price = req.Price,
            Gender = req.Gender,
            Country = req.Country,
            Waterproof = req.Waterproof,
            ImagesURLs = req.ImageURLS
        };
        
        product.Models = req.Models.Select(
            sel => new ModelEntity
            {
                Product = product,
                Model = sel.Key,
                Quantity = sel.Value
            }
            ).ToList();
        _dbContext.Products.Add(product);
        _dbContext.SaveChanges();

        return product;
    }

    public class FilterCount
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Count must be greater than 0.")]
        public int Count { get; set; } = 1;
    }

    /*[HttpGet("GetCount", Name = "GetCount")]
    public IActionResult GetCount([FromQuery] FilterCount aa )
    {
        var res = new
        {
            message = (int)(Math.Ceiling((double)_dbContext.Products.Count() / aa.Count))
        };
        return Json(res);
    }*/



    [HttpGet(Name = "GetProducts")]
    public ProductFilterResponse Get([FromQuery] ProductFilterRequest? filters)
    {
        filters ??= new ProductFilterRequest();
        var select = _dbContext.Products.Select(
            sel => new ProductEntity
            {
                Id = sel.Id,
                Name = sel.Name,
                Description = sel.Description,
                BrandId = sel.BrandId,
                Price = sel.Price,
                Gender = sel.Gender,
                Country = sel.Country,
                Waterproof = sel.Waterproof,
                ImagesURLs = sel.ImagesURLs,
                Brand = new BrandEntity
                {
                    Id = sel.Brand.Id,
                    Name = sel.Brand.Name,
                    Description = sel.Brand.Description,
                    ExternalLogoId = sel.Brand.ExternalLogoId
                },
                Models = sel.Models.Select(
                        sell => new ModelEntity
                        {
                            Id = sell.Id,
                            ProductId = sell.ProductId,
                            Model = sell.Model,
                            Quantity = sell.Quantity
                        }
                    ).ToList()

            }
        ).Where(
            c =>
                (filters.Name == null || c.Name.Contains(filters.Name)) &&
                (filters.BrandId == null || c.BrandId == filters.BrandId) &&
                (filters.MinPrice == null || c.Price >= filters.MinPrice) &&
                (filters.MaxPrice == null || c.Price <= filters.MaxPrice) &&
                (filters.Gender == null || c.Gender == filters.Gender) &&
                (filters.Country == null || c.Country.ToLower().Contains(filters.Country.ToLower())) &&
                (filters.Waterproof == null || c.Waterproof <= filters.Waterproof)
            );

        //var res = select.Skip(filters.Count * filters.Offset).Take(filters.Count).ToList();

        var total = select.Count();
        var totalPages = (int)Math.Ceiling((double)total / filters.Count);
        var res = new ProductFilterResponse
        {
            Products = select.Skip(filters.Count * filters.Offset).Take(filters.Count).ToList(),
            TotalPages = totalPages-1,
            TotalItems = total,
            RemainingPages = Math.Max(totalPages - (filters.Offset + 1), 0)
        };

        return res;
    }

    [HttpGet("{id}", Name = "GetProduct")]
    public ProductEntity Get(int id)
    {
        return _dbContext.Products
            .Select(c => new ProductEntity
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                BrandId = c.BrandId,
                Price = c.Price,
                Gender = c.Gender,
                Country = c.Country,
                Waterproof = c.Waterproof,
                ImagesURLs = c.ImagesURLs,

                Brand = new BrandEntity
                {
                    Id = c.Brand.Id,
                    Name = c.Brand.Name,
                    Description = c.Brand.Description,
                    ExternalLogoId = c.Brand.ExternalLogoId,
                },

                Models = c.Models.Select(
                        ss => new ModelEntity
                        {
                            Id = ss.Id,
                            ProductId = ss.ProductId,
                            Model = ss.Model,
                            Quantity = ss.Quantity
                        }
                    ).ToList(),
            }
            )
            .First(c => c.Id == id);
    }

    [HttpPatch("{id}", Name = "PatchProduct")]
    //[Authorization.Authorize(Role.Salesman)]
    public void Patch(int id, [FromBody] CreateProductRequest req)
    {
        var prod = _dbContext.Products.Find(id);
        if (prod == null)
        {
            throw new FileNotFoundException("Product not found");
        }

        prod.Name = req.Name;
        prod.Price = req.Price;
        prod.Description = req.Description;
        prod.BrandId = req.BrandId;

        if (prod.Models != null)
        {
            // Удаляем старые модели
            _dbContext.Models.RemoveRange(prod.Models);

            // Добавляем новые модели
            prod.Models = req.Models.Select(sel => new ModelEntity
            {
                ProductId = prod.Id,
                Model = sel.Key,
                Quantity = sel.Value
            }).ToList();
        }
        else
        {
            prod.Models = req.Models.Select(sel => new ModelEntity
            {
                ProductId = prod.Id,
                Model = sel.Key,
                Quantity = sel.Value
            }).ToList();
        }
        _dbContext.SaveChanges();
    }

    [Authorization.Authorize(Role.Salesman)]
    [HttpDelete("{id}", Name = "DeleteProduct")]
    public void Delete(int id)
    {
        var prod = _dbContext.Products.Find(id);
        if (prod != null)
        {
            _dbContext.Products.Remove(prod);
        }
        _dbContext.SaveChanges();
    }

}
