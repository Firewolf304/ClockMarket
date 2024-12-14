using System.ComponentModel.DataAnnotations;
using System.Linq;
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
}
