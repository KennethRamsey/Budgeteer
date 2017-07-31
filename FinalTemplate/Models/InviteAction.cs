﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FinalTemplate.Models
{
    public class InviteAction
    {
        [Required]
        public int InviteId { get; set; }
        [Required]
        public string Action { get; set; }

    }
}