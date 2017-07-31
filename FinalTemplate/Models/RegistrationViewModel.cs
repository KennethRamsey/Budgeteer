using CoderFoundry.InsightUserStore.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FinalTemplate.Models
{
    public class RegistrationViewModel
    {
        public int Id { get; set; }

        [Required]
        public string UserName { get; set; }
        [Required]
        [EmailAddress] 
        public string Email { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [Phone( ErrorMessage="Not a valid phone number.")]
        public string PhoneNumber { get; set; }
        [Required]
        [RegularExpression(".{6,}", ErrorMessage="Password must be at least 6 characters long.")]    
        public string Password { get; set; }
        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }

        // for resetting password.
        public string NewPassword { get; set; } // make sure to have server side and client side checking.
        public string ConfirmNewPassword { get; set; }

        // for viewing user
        public int? HouseholdId { get; set; }


        // helper function to return app user.
        public AppUser ToAppUser()
        {
            return new AppUser
            {
                Id = this.Id,
                UserName = this.UserName,
                Email = this.Email,
                Name = this.Name,
                PhoneNumber = this.PhoneNumber,
            };
        }

    }

}