using RGRPOIS.Services;

namespace RGRPOIS.Helpers.Auth;

using Microsoft.Extensions.Options;
using Helpers;
using RGRPOIS.Helpers.Helpers;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly Config _appSettings;

    public JwtMiddleware(RequestDelegate next, IOptions<Config> appSettings)
    {
        _next = next;
        _appSettings = appSettings.Value;
    }

    public async Task Invoke(HttpContext context, IUserService userService, IJwtUtils jwtUtils)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        var userId = jwtUtils.ValidateJwtToken(token);
        if (userId != null)
        {
            // attach user to context on successful jwt validation
            context.Items["User"] = userService.GetById(userId.Value);
        }

        await _next(context);
    }
}