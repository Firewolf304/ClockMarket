using Microsoft.Extensions.Options;
using RGRPOIS.Models.DTO;
using RGRPOIS.Helpers.Auth;
using RGRPOIS.Helpers;
using RGRPOIS.Helpers.Models;
using RGRPOIS.Helpers.Helpers;

namespace RGRPOIS.Services;

public interface IUserService
{
    AuthenticateResponse Authenticate(AuthenticateRequest model);
    IEnumerable<UserEntity> GetAll();
    UserEntity GetById(int id);
}
public class UserService : IUserService
{
    private AppDBContext _context;
    private IJwtUtils _jwtUtils;
    private readonly Config _appSettings;

    public UserService(
        AppDBContext context,
        IJwtUtils jwtUtils,
        IOptions<Config> appSettings)
    {
        _context = context;
        _jwtUtils = jwtUtils;
        _appSettings = appSettings.Value;
    }
    public AuthenticateResponse Authenticate(AuthenticateRequest model)
    {
        var user = _context.Users.SingleOrDefault(x => x.Username == model.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
        {
            throw new ApplicationException("Username or password is incorrect");
        }
        var jwtToken = _jwtUtils.GenerateJwtToken(user);

        Console.WriteLine($"JFT={jwtToken}");

        return new AuthenticateResponse(user, jwtToken);
    }

    public IEnumerable<UserEntity> GetAll()
    {
        return _context.Users;
    }

    public UserEntity GetById(int id)
    {
        var user = _context.Users.Find(id);
        if (user == null) throw new KeyNotFoundException("User not found");
        return user;
    }
}
