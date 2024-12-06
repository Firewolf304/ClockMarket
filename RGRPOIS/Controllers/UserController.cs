using System;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using RGRPOIS.Models.DTO;
using RGRPOIS.Helpers;
using RGRPOIS.Helpers.Auth;
using RGRPOIS.Helpers.Helpers;
using RGRPOIS.Helpers.Models;
using RGRPOIS.Services;

namespace RGRPOIS.Helpers.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : Controller
{
    private readonly ILogger<UserController> _logger;
    private readonly AppDBContext _dbContext;
    private readonly IUserService _userService;
    private readonly IJwtUtils _jwtUtils;
    private readonly Config _config;

    public UserController(
        ILogger<UserController> logger, 
        AppDBContext dbContext,
        IUserService userService, 
        IJwtUtils jwtUtils, 
        IOptions<Config> appSettings
    )
    {
        _logger = logger;
        _dbContext = dbContext;
        _userService = userService;
        _jwtUtils = jwtUtils;
        _config = appSettings.Value;
    }

    [HttpGet(Name = "GetUsers")]
    [Authorization.Authorize(Role.Salesman)]
    public IEnumerable<UserEntity> Get()
    {
        return _dbContext.Users;
    }

    [HttpGet("{id}", Name = "GetUser")]
    [Authorization.Authorize(Role.Salesman)]
    public UserEntity Get(int id)
    {
        return _dbContext.Users.Find(id);
    }

    [HttpGet("me", Name = "GetMe")]
    [Authorization.Authorize]
    public UserEntity GetMe()
    {
        var user = (UserEntity)HttpContext.Items["User"];
        return user;
    }


    [HttpPost(Name = "CreateUser")]
    [AllowAnonymous]
    public UserEntity Create(
        [FromBody] CreateUserRequest req)
    {
        var user = _dbContext.Users.Add(
            new UserEntity
            {
                Firstname = req.Firstname,
                Lastname = req.Lastname,
                Username = req.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            }
        );

        _dbContext.SaveChanges();
        return user.Entity;
    }

    [HttpDelete("{id}", Name = "DeleteUser")]
    [Authorization.Authorize(Role.Salesman)]
    public void Delete(int id)
    {
        var user = _dbContext.Users.Find(id);
        _dbContext.Users.Remove(user);
        _dbContext.SaveChanges();
    }

    [HttpPost("authenticate", Name = "Authenticate")]
    [AllowAnonymous]
    public AuthenticateResponse Authenticate(
        [FromBody] AuthenticateRequest req
    )
    {
        var response = _userService.Authenticate(req);

        // log response
        _logger.LogInformation("User {Username} authenticated, {response}", req.Username, response.Token);

        return response;
    }

}
