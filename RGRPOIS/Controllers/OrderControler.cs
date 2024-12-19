using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RGRPOIS.Helpers.Models;
using RGRPOIS.Models.DTO;

namespace RGRPOIS.Helpers.Controllers;

[ApiController]
[Route("[controller]")]
public class OrderControler : Controller
{
    private readonly ILogger<UserController> _logger;
    private readonly AppDBContext _dbContext;

    public OrderControler(ILogger<UserController> logger,
        AppDBContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    public class CreateOrderRequestItem
    {
        public int ModelID { get; set; }
        public int Quantity { get; set; }
    }
    public class CreateOrderRequest
    {
        public IEnumerable<CreateOrderRequestItem> Items { get; set; }
        public AddressPurposeEntity Address { get; set; } = null!;
        public string? Comment { get; set; }
    }

    [Authorization.Authorize]
    [HttpPost(Name = "CreateOrder")]
    public void Create([FromBody] CreateOrderRequest req)
    {
        var user = (UserEntity)HttpContext.Items["User"];
        var order = new OrderEntity
        {
            Address = req.Address,
            UserId = user.Id,
            Comment = req.Comment,
            Items = req.Items.Select(
                i => new OrderItemEntity
                {
                    ModelID = i.ModelID,
                    Quantity = i.Quantity
                }).ToList()
        };
        foreach (var item in order.Items)
        {
            var model = _dbContext.Models.Find(item.ModelID);
            model.Quantity -= item.Quantity;
        }

        _dbContext.Orders.Add(order);
        _dbContext.SaveChanges();
    }
    [Authorization.Authorize]
    [HttpGet(Name = "GetMyOrders")]
    public IEnumerable<OrderEntity> GetMyOrders()
    {
        var user = (UserEntity)HttpContext.Items["User"];
        return _dbContext.Orders.Where(o => o.UserId == user.Id && o.Status != OrderStatus.Delivered).Select(
            o => new OrderEntity
            {
                Id = o.Id,
                Address = o.Address,
                Status = o.Status,
                Comment = o.Comment,
                TrackingNumber = o.TrackingNumber,
                CreatedAt = o.CreatedAt,
                Items = o.Items.Select(
                    i => new OrderItemEntity
                    {
                        Id = i.Id,
                        Quantity = i.Quantity,
                        Model = new ModelEntity
                        {
                            Id = i.Model.Id,
                            Model = i.Model.Model,
                            Product = new ProductEntity
                            {
                                Id = i.Model.Product.Id,
                                Name = i.Model.Product.Name,
                                Brand = new BrandEntity
                                {
                                    Id = i.Model.Product.Brand.Id,
                                    Name = i.Model.Product.Brand.Name,
                                    Description = i.Model.Product.Brand.Description,
                                    ExternalLogoId = i.Model.Product.Brand.ExternalLogoId
                                },
                                Description = i.Model.Product.Description,
                                Price = i.Model.Product.Price,
                                ImagesURLs = i.Model.Product.ImagesURLs
                            }
                        }
                    }
                )
            }
        ).OrderByDescending(
            o => o.CreatedAt
        );
    }

    [HttpGet("all", Name = "GetAllOrders")]
    [Authorization.Authorize(Role.Salesman)]
    public IEnumerable<OrderEntity> GetAllOrders()
    {
        return _dbContext.Orders.Select(
            o => new OrderEntity
            {
                Id = o.Id,
                Address = o.Address,
                Status = o.Status,
                Comment = o.Comment,
                TrackingNumber = o.TrackingNumber,
                CreatedAt = o.CreatedAt,
                Items = o.Items.Select(
                    i => new OrderItemEntity
                    {
                        Id = i.Id,
                        Quantity = i.Quantity,
                        Model = new ModelEntity
                        {
                            Id = i.Model.Id,
                            Model = i.Model.Model,
                            Product = new ProductEntity
                            {
                                Id = i.Model.Product.Id,
                                Name = i.Model.Product.Name,
                                Brand = new BrandEntity
                                {
                                    Id = i.Model.Product.Brand.Id,
                                    Name = i.Model.Product.Brand.Name,
                                    Description = i.Model.Product.Brand.Description,
                                    ExternalLogoId = i.Model.Product.Brand.ExternalLogoId
                                },
                                Description = i.Model.Product.Description,
                                Price = i.Model.Product.Price,
                                ImagesURLs = i.Model.Product.ImagesURLs
                            }
                        }
                    }
                )
            }
        ).OrderByDescending(
            o => o.CreatedAt
        );
    }
    

    public class PatchOrderRequest
    {
        public OrderStatus Status { get; set; }
        public string? TrackingNumber { get; set; }
    }

    [HttpPatch("{id}", Name = "PatchOrder")]
    [Authorization.Authorize(Role.Salesman)]
    public void Patch(int id, [FromBody] PatchOrderRequest req)
    {
        var order = _dbContext.Orders.Find(id);
        if (order == null)
        {
            throw new FileNotFoundException("Order not found");
        }

        order.Status = req.Status;
        order.TrackingNumber = req.TrackingNumber;
        _dbContext.SaveChanges();
    }
}
