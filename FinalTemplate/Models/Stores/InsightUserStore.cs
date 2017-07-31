using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CoderFoundry.InsightUserStore.DataAccess;
using CoderFoundry.InsightUserStore.Models;
using Microsoft.AspNet.Identity;

namespace CoderFoundry.InsightUserStore.Infrastructure
{
    public class InsightUserStore :
        IUserStore<AppUser, int>,
        IUserPhoneNumberStore<AppUser, int>,
        IUserPasswordStore<AppUser, int>,
        IUserLoginStore<AppUser, int>,
        IUserRoleStore<AppUser, int>,
        IUserClaimStore<AppUser, int>,
        IUserEmailStore<AppUser, int>,
        IUserLockoutStore<AppUser, int>,
        IUserSecurityStampStore<AppUser, int>,
        IUserTwoFactorStore<AppUser, int>
    {
        private readonly IUserDataAccess _userData;


        public InsightUserStore(IUserDataAccess userData)
        {
            _userData = userData;
        }


        public void Dispose()
        {
            throw new NotImplementedException();
        }



        public async Task<string> GetPhoneNumberAsync(AppUser user)
        {
            return user.PhoneNumber;
        }
        

        public async Task<bool> GetPhoneNumberConfirmedAsync(AppUser user)
        {
            return user.PhoneNumberConfirmed;
        }


        public async Task SetPhoneNumberAsync(AppUser user, string phoneNumber)
        {
            user.PhoneNumber = phoneNumber;
            return;
        }


        public async Task SetPhoneNumberConfirmedAsync(AppUser user, bool confirmed)
        {
            user.PhoneNumberConfirmed = confirmed;
            return;
        }


        public async Task CreateAsync(AppUser user)
        {
            await _userData.InsertUserAsync(user);
            return;
        }


        public async Task DeleteAsync(AppUser user)
        {
            await _userData.DeleteUserAsync(user.Id);
            return;
        }


        public async Task<AppUser> FindByIdAsync(int userId)
        {
            return await  _userData.SelectUserAsync(userId);
        }


        public async Task<AppUser> FindByNameAsync(string userName)
        {
            return await _userData.FindUserByUserNameAsync(userName);
        }


        public async Task UpdateAsync(AppUser user)
        {
            await _userData.UpdateUserAsync(user);
            return;
        }


        public async Task<string> GetPasswordHashAsync(AppUser user)
        {
            return user.PasswordHash;
        }


        public async Task<bool> HasPasswordAsync(AppUser user)
        {
            // Is this right?
            return user.PasswordHash != null;
        }


        public async Task SetPasswordHashAsync(AppUser user, string passwordHash)
        {
            user.PasswordHash = passwordHash;
            return;
        }


        public async Task AddLoginAsync(AppUser user, UserLoginInfo login)
        {
            var newUserLogin = new UserLogin {
                UserId = user.Id,
                LoginProvider = login.LoginProvider,
                ProviderKey = login.ProviderKey
            };

            await _userData.InsertUserLoginAsync(newUserLogin);
            return;
        }


        public async Task<AppUser> FindAsync(UserLoginInfo login)
        {
            return await _userData.FindUserByLoginAsync(login.LoginProvider, login.ProviderKey);
        }


        public async Task<IList<UserLoginInfo>> GetLoginsAsync(AppUser user)
        {
            // Test this!
            var userLogins = await _userData.GetLoginsForUserAsync(user.Id);
            return userLogins.Select(ul => new UserLoginInfo(ul.LoginProvider, ul.ProviderKey)).ToList();
        }
        

        public async Task RemoveLoginAsync(AppUser user, UserLoginInfo login)
        {
            UserLogin userlogin = new UserLogin {
                LoginProvider = login.LoginProvider,
                ProviderKey = login.ProviderKey,
                UserId = user.Id
            };
            await _userData.DeleteUserLoginAsync(userlogin);
        }


        public async Task AddToRoleAsync(AppUser user, string roleName)
        {
            await _userData.AddUserToRoleAsync(user.Id, roleName);
            return;
        }


        public async Task<IList<string>> GetRolesAsync(AppUser user)
        {
            return await _userData.GetRolesForUserAsync(user.Id);
        }


        public async Task<bool> IsInRoleAsync(AppUser user, string roleName)
        {
            return await _userData.IsUserInRoleAsync(user.Id, roleName);
        }


        public async Task RemoveFromRoleAsync(AppUser user, string roleName)
        {
            await _userData.RemoveUserFromRoleAsync(user.Id, roleName);
            return;
        }


        public async Task<IList<Claim>> GetClaimsAsync(AppUser user)
        {
            var userClaims = await _userData.GetUserClaimsAsync(user.Id);
            return userClaims.Select(uc => new Claim(uc.ClaimType, uc.ClaimValue)).ToList();
        }


        public async Task AddClaimAsync(AppUser user, Claim claim)
        {
            await _userData.InsertUserClaimAsync(
                    new UserClaim {
                        UserId = user.Id,
                        ClaimType = claim.Type,
                        ClaimValue = claim.Value
            });

            return;
        }


        public async Task RemoveClaimAsync(AppUser user, Claim claim)
        {
            await _userData.RemoveUserClaimAsync(user.Id, claim.Type);
            return;
        }
             
   
        public async Task<AppUser> FindByEmailAsync(string email)
        {
            return await _userData.FindUserByEmailAsync(email);      
        }


        public async Task<string> GetEmailAsync(AppUser user)
        {
            return user.Email;
        }


        public async Task<bool> GetEmailConfirmedAsync(AppUser user)
        {
            return user.EmailConfirmed;
        }


        public async Task SetEmailAsync(AppUser user, string email)
        {
            user.Email = email;
            return;
        }


        public async Task SetEmailConfirmedAsync(AppUser user, bool confirmed)
        {
            user.EmailConfirmed = confirmed;
            return;
        }


        public async Task<int> GetAccessFailedCountAsync(AppUser user)
        {
            return user.AccessFailedCount;
        }


        public async Task<bool> GetLockoutEnabledAsync(AppUser user)
        {
            return user.LockoutEnabled;
        }


        public async Task<DateTimeOffset> GetLockoutEndDateAsync(AppUser user)
        {
            return user.LockoutEndDate;
        }


        public async Task<int> IncrementAccessFailedCountAsync(AppUser user)
        {
            user.AccessFailedCount++;
            return user.AccessFailedCount; // Ask About This.
        }


        public async Task ResetAccessFailedCountAsync(AppUser user)
        {
            user.AccessFailedCount = 0;
            return;
        }


        public async Task SetLockoutEnabledAsync(AppUser user, bool enabled)
        {
            user.LockoutEnabled = enabled;
            return;
        }


        public async Task SetLockoutEndDateAsync(AppUser user, DateTimeOffset lockoutEnd)
        {
            user.LockoutEndDate = lockoutEnd;
            return;
        }


        public async Task<string> GetSecurityStampAsync(AppUser user)
        {
            return user.SecurityStamp;
        }


        public async Task SetSecurityStampAsync(AppUser user, string stamp)
        {
            user.SecurityStamp = stamp;
            return;
        }


        public async Task<bool> GetTwoFactorEnabledAsync(AppUser user)
        {
            throw new NotImplementedException();
        }


        public async Task SetTwoFactorEnabledAsync(AppUser user, bool enabled)
        {
            throw new NotImplementedException();
        }

    }
}