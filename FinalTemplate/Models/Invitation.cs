using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FinalTemplate.Models
{
    public class Invitation
    {
        public int Id { get; set; }
        public int FromUserId { get; set; } // required for db.
        public string FromUserName { get; set; } // required for db, but we will get it on the server
        [Required]
        public string ToEmail { get; set; }

    }
}