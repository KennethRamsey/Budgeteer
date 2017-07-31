using System.Collections.Generic;
using System.Threading.Tasks;
using CoderFoundry.InsightUserStore.Models;
using Insight.Database;

namespace CoderFoundry.InsightUserStore.DataAccess
{
    [Sql(Schema = "security")]
    public interface IUserDataAccess
    {
        // these are all stored procedures that YOU will have to write!

        Task<AppUser> FindUserByUserNameAsync(string userName);
        Task<bool> IsUserInRoleAsync(int userId, string role);
        Task<IList<string>> GetRolesForUserAsync(int userId);
        Task RemoveUserFromRoleAsync(int userId, string role);
        Task<IList<UserLogin>> GetLoginsForUserAsync(int userId);
        Task<AppUser> FindUserByLoginAsync(string loginProvider, string providerKey);
        Task<IList<UserClaim>> GetUserClaimsAsync(int userId);
        Task<AppUser> FindUserByEmailAsync(string email);
        Task RemoveUserClaimAsync(int userId, string claimType);
        Task<bool> AddUserToRoleAsync(int userId, string role);


        // auto procs

        Task<AppUser> SelectUserAsync(int id);
        Task DeleteUserAsync(int id);
        Task UpdateUserAsync(AppUser user);
        Task InsertUserAsync(AppUser user);
        Task InsertUserLoginAsync(UserLogin userLogin);
        Task DeleteUserLoginAsync(UserLogin login);
        Task InsertUserClaimAsync(UserClaim claim);
    }
}