using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Owin;
using FinalTemplate.Models;
using CoderFoundry.InsightUserStore.Models;
using FinalTemplate.ApiControllers;
using System.Data.SqlClient;
using CoderFoundry.InsightUserStore.DataAccess;
using Insight.Database;


namespace FinalTemplate.Controllers
{
    [Authorize]
    [RoutePrefix("api/authentication")]
    public class AuthenticationController : ApiController
    {
        private ApplicationUserManager _userManager;
        private IUserDataAccess _userData;

        public AuthenticationController()
        {
            _userData = _userData ?? HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<IUserDataAccess>();
        }

        public AuthenticationController(ApplicationUserManager userManager)
            : this()
        {
            UserManager = userManager;
        }

        // property for UserManager
        public ApplicationUserManager UserManager
        {
            get { return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>(); }
            private set { _userManager = value; }
        }

        // GET
        [Route("check")]
        public async Task<IHttpActionResult> GetCheck()
        {
            return Ok(); // this checks that the user is acturally authrized on start up.
        }


        // GET
        [Route("user")]
        public async Task<IHttpActionResult> GetUser()
        {
            AppUser user = await UserManager.FindByNameAsync(User.Identity.Name);
            RegistrationViewModel returnUser = new RegistrationViewModel
            {
                Email = user.Email,
                Id = user.Id,
                Name = user.Name,
                PhoneNumber = user.PhoneNumber,
                UserName = user.UserName,
                HouseholdId = user.HouseholdId
            };

            return Ok(returnUser);
        }


        //POST
        [Route("user")]
        public async Task<IHttpActionResult> PostUser([FromBody]RegistrationViewModel edittedUser)
        {
            //check inputs
            if (ModelState.IsValid)
            {
                AppUser user = await UserManager.FindByNameAsync(edittedUser.UserName);

                //Should check password
                if (await UserManager.CheckPasswordAsync(user, edittedUser.Password))
                {
                    // update user.
                    user.Email = edittedUser.Email;
                    user.PhoneNumber = edittedUser.PhoneNumber;

                    UserManager.Update(user);

                    // to change password must have new and newConfirmed.
                    if (edittedUser.NewPassword != null && edittedUser.NewPassword == edittedUser.ConfirmNewPassword)
                    {
                        // password requirements should be check by manager??
                        await UserManager.ChangePasswordAsync(edittedUser.Id, edittedUser.Password, edittedUser.NewPassword);
                    }

                    return Ok();
                }
                else
                    return BadRequest("password was incorrect.");
            }
            else
                return BadRequest("user is invalid");

        }



        [Route("register")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<IHttpActionResult> PostRegister([FromBody]RegistrationViewModel newUser)
        {
            // check model.
            if (ModelState.IsValid)
            {
                var user = new AppUser
                {
                    UserName = newUser.UserName,
                    Email = newUser.Email,
                    Name = newUser.Name,
                    PhoneNumber = newUser.PhoneNumber,
                    LockoutEnabled = false,
                    IsDeleted = false,
                    IsLockedOut = false
                    // household will be updated at a later time.
                };

                // Create and save User.
                IdentityResult result = await UserManager.CreateAsync(user, newUser.Password);

                // return bool of success.
                return Ok(result.Errors);
            }

            // bad call, return error.
            return Ok(ModelState.SelectMany(kvPair => kvPair.Value.Errors.Select(e => e.ErrorMessage)));
        }

    }
}