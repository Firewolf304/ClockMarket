using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RGRPOIS.Helpers.Controllers;
using RGRPOIS.Helpers;
using RGRPOIS.Helpers.Models;
using RGRPOIS.Models.DTO;
using System.ComponentModel.DataAnnotations;

namespace RGRPOIS.Controllers;

[ApiController]
[Route("[controller]")]
public class BrandController : Controller
{
    private readonly ILogger<UserController> _logger;
    private readonly AppDBContext _dbContext;

    public BrandController(ILogger<UserController> logger,
        AppDBContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }
    [HttpGet(Name = "GetBrands")]
    public IEnumerable<BrandEntity> Get()
    {
        return _dbContext.Brands;
    }

    


    [HttpPost(Name = "CreateBrand")]
    public BrandEntity Create([FromBody] CreateBrandRequest req)
    {
        var brand = _dbContext.Brands.Add(
            new BrandEntity
            {
                Name = req.Name,
                Description = req.Description,
                ExternalLogoId = req.ExternalLogoId
            }
        );
        _dbContext.SaveChanges();
        return brand.Entity;
    }
}
