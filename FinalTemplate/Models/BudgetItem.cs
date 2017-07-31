using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FinalTemplate.Models
{
    public class BudgetItem
    {
        public int? Id { get; set; }
        public int HouseholdId { get; set; } // add in webAPI
        [Required]
        public string Name { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public bool IsExpense { get; set; }

        // sums.
        public decimal sum { get; set; }
    }
}