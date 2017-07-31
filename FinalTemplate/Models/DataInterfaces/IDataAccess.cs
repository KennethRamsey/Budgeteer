using CoderFoundry.InsightUserStore.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Insight.Database;
using Insight;
using System.Data.SqlClient;
using CoderFoundry.InsightUserStore.Models;

namespace FinalTemplate.Models.DataInterfaces
{
    [Sql(Schema="dbo")]
    public interface IDataAccess
    {
        // account
        [Sql("select * from [dbo].Accounts as a where a.HouseholdId = @householdId")]
        Task<List<Account>> GetAccountsAsync(int householdId);
        Task InsertAccountAsync(Account account);
        Task<Account> SelectAccountAsync(int Id);
        [Sql("select * from dbo.Accounts as a where a.HouseholdId = @householdId")]
        Task<List<Account>> GetAccountsByHouseholdAsync(int householdId);
        [Sql("select * from dbo.Accounts as a where a.name = @accountName and a.householdId = @householdId")]
        Task<Account> SelectAccountByNameAsync(string accountName, int householdId);
        Task DeleteAccountAsync(int Id); // account id.
        Task UpdateAccountAsync(Account acc);


        // budget
        [Sql("select * from [dbo].BudgetItems as b where b.HouseholdId = @householdId and (@isExpense is null or b.IsExpense = @isExpense)")]
        Task<List<BudgetItem>> GetBudgetAsync(int householdId, bool? isExpense = null); // Remember this can get budget, get incomes, get expenses!!!
        Task<BudgetItem> SelectBudgetItemAsync(int id);
        Task InsertBudgetItemAsync(BudgetItem budgetItem);
        Task UpdateBudgetItemAsync(BudgetItem budgetItem);
        Task DeleteBudgetItemAsync(int Id);
        Task<List<BudgetItem>> GetMonthSumsAsync(int householdId, DateTime startOfMonth, DateTime endOfMonth);


        //household
        Task<Household> InsertHouseholdAsync();
        [Sql("select * from security.Users as u where u.HouseholdId = @householdId")]
        Task<List<AppUser>> GetHouseholdMembersAsync(int householdId);
        Task DeleteHouseholdAsync(int householdId);


        //invitations
        [Sql("select * from [dbo].[Invitations] as i where i.ToEmail = @email")]
        Task<List<Invitation>> GetInvitationsAsync(string email);
        Task<Invitation> SelectInvitationAsync(int Id);
        Task DeleteInvitationAsync(int Id);
        Task InsertInvitationAsync(Invitation invite);


        // transactions
        Task<List<Transaction>> GetRecentTransactionsAsync(int householdId);
        Task<List<Transaction>> GetTransactionsAsync(TransactionOptions options);
        Task<Transaction> SelectTransactionAsync(int id);
        Task InsertTransactionAsync(Transaction tr);
        Task UpdateTransactionAsync(Transaction tr);
        Task DeleteTransactionAsync(int Id);
    }
}
