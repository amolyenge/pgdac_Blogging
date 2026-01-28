using System.Security.Claims;

namespace BloggingApp.API.Helpers
{
    public static class UserContextHelper
    {
        public static int GetUserId(ClaimsPrincipal user)
        {
            return int.Parse(
                user.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value
            );
        }

        public static string GetUserRole(ClaimsPrincipal user)
        {
            return user.Claims.First(c => c.Type == ClaimTypes.Role).Value;
        }
    }
}
