using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FinalTemplate.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        [Required]
        public int AccountId { get; set; }
        [Required]
        [RegularExpression(@"\d+(\.\d{1,2})?", ErrorMessage = "Invalid price")]
        public decimal Amount { get; set; }
        [Required]
        public bool Reconciled { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public DateTime Updated { get; set; } // today
        public int UpdatedByUserId { get; set; } // default user
        public int? BudgetItemId { get; set; }
        [Required]
        public bool IsDeposit { get; set; }


        // extra props used for displaying transactions only.
        public string UserName { get; set; }
        public string AccountName { get; set; }
        public string BudgetName { get; set; }
    }
}