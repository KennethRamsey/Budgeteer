using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinalTemplate.Models
{
    public class TransactionOptions
    {
        public string Sort { get; set; }
        public string Order { get; set; }
        public int? page { get; set; }
        public int? HouseholdId { get; set; }

        public int Id { get; set; }
        public int? AccountId { get; set; }
        public double? Amount { get; set; }
        public bool? Reconciled { get; set; }
        public DateTime? Date { get; set; }
        public string Description { get; set; }
        public DateTime? Updated { get; set; }
        public int? UpdatedByUserId { get; set; }
        public int? BudgetItemId { get; set; }

        // what to do about this property??
        public bool? IsDeposit { get; set; }

        // extra prop for recent transactions

        public string UserName { get; set; }
        public string BudgetName { get; set; } // budget item name
    }
}