using CoderFoundry.InsightUserStore.DataAccess;
using FinalTemplate.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity.Owin;
using System.Web;
using Insight.Database;
using FinalTemplate.Models.DataInterfaces;
using System.Threading.Tasks;
using CoderFoundry.InsightUserStore.Models;

namespace FinalTemplate.ApiControllers
{
    [Authorize]
    [RoutePrefix("api")]
    public class DataController : ApiController
    {

        private ApplicationUserManager userManager;
        private IDataAccess db;

        public DataController()
        {
            userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            db = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<IDataAccess>();
        }


        #region Accounts

        [Route("Accounts")]
        public async Task<IHttpActionResult> getAccounts()
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);

            List<Account> accountList = null;
            if (user.HouseholdId.HasValue) accountList = await db.GetAccountsByHouseholdAsync(user.HouseholdId.Value);

            return Ok(accountList);
        }

        [Route("Accounts")]
        public async Task<IHttpActionResult> postAccount(Account acc)
        {
            // check input
            if (ModelState.IsValid)
            {

                AppUser user = await userManager.FindByNameAsync(User.Identity.Name);

                if (!user.HouseholdId.HasValue) return BadRequest("User must be in household to add an account.");

                var duplicate = await db.SelectAccountByNameAsync(acc.Name, user.HouseholdId.Value);

                if (duplicate == null)
                {
                    acc.HouseholdId = user.HouseholdId.Value;

                    // add account
                    await db.InsertAccountAsync(acc);

                    return Ok();
                }



                return BadRequest("account already exists.");
            }

            return BadRequest("account is not valid.");
        }


        [Route("Accounts/{id}")]
        [HttpDelete]
        public async Task deleteAccount(int id)
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);
            var acc = await db.SelectAccountAsync(id);

            // check that user can delete the account.
            if (acc.HouseholdId == user.HouseholdId)
            {
                // must delete transactions before deleting account
                var trList = await db.GetTransactionsAsync(new TransactionOptions { AccountId = acc.Id });

                trList.ForEach(tr => { db.DeleteTransactionAsync(tr.Id).Wait(); });

                // now can delete account.
                db.DeleteAccountAsync(id).Wait();
                Ok();
            }

            BadRequest("can't delete account");
        }

        #endregion


        #region Household

        [Route("Household/new")]
        public async Task<IHttpActionResult> postnewHousehold()
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);
            Household house = await db.InsertHouseholdAsync();

            user.HouseholdId = house.Id;
            await userManager.UpdateAsync(user);

            return Ok();
        }

        [Route("Household/leave")]
        public async Task<IHttpActionResult> postleaveHousehold()
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);
            Household house = await db.InsertHouseholdAsync();

            user.HouseholdId = null;
            await userManager.UpdateAsync(user);

            return Ok();
        }


        [Route("Household/members")]
        public async Task<IHttpActionResult> getHouseholdMembers()
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);

            List<AppUser> members = null;
            if (user.HouseholdId.HasValue) members = await db.GetHouseholdMembersAsync(user.HouseholdId.Value);

            return Ok(members);
        }


        #endregion


        #region Invites
        [Route("Household/Invites")]
        public async Task<IHttpActionResult> getInvites()
        {
            AppUser user = await userManager.FindByNameAsync(User.Identity.Name);

            List<Invitation> inviteList = await db.GetInvitationsAsync(user.Email);

            return Ok(inviteList);
        }


        [Route("Household/Invite")]
        public async Task<IHttpActionResult> postInvites([FromBody]Invitation invite)
        {
            //check inputs
            if (ModelState.IsValid)
            {
                // remember to set extra fields
                invite.FromUserName = User.Identity.Name;
                invite.FromUserId = (await userManager.FindByNameAsync(User.Identity.Name)).Id;

                // save
                await db.InsertInvitationAsync(invite);
                return Ok();
            }

            return BadRequest("Invite is invalid.");
        }


        [Route("Household/Invite/act")]
        [HttpPost]
        public async Task<IHttpActionResult> postInviteAction([FromBody]InviteAction act)
        {
            AppUser user = await userManager.FindByNameAsync(User.Identity.Name);
            Invitation invite = await db.SelectInvitationAsync(act.InviteId);

            // double check that user email matches invite email
            if (user.Email == invite.ToEmail)
            {
                if (act.Action == "accept")
                {
                    // get household if invitor
                    AppUser invitor = await userManager.FindByIdAsync(invite.FromUserId);

                    // update user AND delete invite.
                    user.HouseholdId = invitor.HouseholdId;
                    await userManager.UpdateAsync(user);
                    await db.DeleteInvitationAsync(act.InviteId);

                    return Ok();
                }

                else if (act.Action == "decline")
                {
                    await db.DeleteInvitationAsync(act.InviteId);
                    return Ok();
                }

                else
                    return BadRequest("Only allowed actions are 'accept' or 'decline'.");

            }
            else
                return BadRequest("Invite does not belong to user.");
        }


        #endregion


        #region Budget

        [Route("Budget")]
        public async Task<IHttpActionResult> getBudget()
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);

            List<BudgetItem> budget = null;
            if (user.HouseholdId.HasValue) budget = await db.GetBudgetAsync(user.HouseholdId.Value);

            return Ok(budget);
        }

        [Route("Budget/Incomes")]
        public async Task<IHttpActionResult> getBudgetIncomes()
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);

            List<BudgetItem> incomes = null;
            if (user.HouseholdId.HasValue) incomes = await db.GetBudgetAsync(user.HouseholdId.Value, isExpense: false);

            return Ok(incomes);
        }

        [Route("Budget/Expenses")]
        public async Task<IHttpActionResult> getBudgetExpenses()
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);

            List<BudgetItem> expenses = null;
            if (user.HouseholdId.HasValue) expenses = await db.GetBudgetAsync(user.HouseholdId.Value, isExpense: true);

            return Ok(expenses);
        }


        [Route("Budget")]
        public async Task<IHttpActionResult> postBudget(BudgetItem budgetItem)
        {
            // check inputs
            if (ModelState.IsValid)
            {
                var user = await userManager.FindByNameAsync(User.Identity.Name);
                budgetItem.HouseholdId = user.HouseholdId.Value;

                await db.InsertBudgetItemAsync(budgetItem);
                return Ok();
            }

            return BadRequest("budget item not valid.");
        }


        [Route("Budget/ThisMonth")]
        public async Task<IHttpActionResult> getBudgetThisMonth()
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);
            var now = DateTime.Now;
            var start = new DateTime(now.Year, now.Month, 1);
            var end = start.AddMonths(1).AddDays(-1);

            // just to catch errors.
            if (!user.HouseholdId.HasValue) return BadRequest("not in household.");

            List<BudgetItem> sums = await db.GetMonthSumsAsync(user.HouseholdId.Value, start, end);

            return Ok(sums);
        }


        [Route("Budget/{BudgetItemId}")]
        public async Task<IHttpActionResult> postupdateBudget(BudgetItem budgetItem, int budgetItemId)
        {
            // check inputs
            if (ModelState.IsValid)
            {
                var user = await userManager.FindByNameAsync(User.Identity.Name);
                budgetItem.Id = budgetItemId; // don't want no funny business with id differences.
                budgetItem.HouseholdId = user.HouseholdId.Value; // MOST IMPORTANT

                // check that budget item belongs to user's house
                BudgetItem budgetItemOriginal = await db.SelectBudgetItemAsync(budgetItemId);

                if (budgetItemOriginal.HouseholdId == user.HouseholdId)
                {
                    await db.UpdateBudgetItemAsync(budgetItem);
                    return Ok();
                }
                else
                    return BadRequest("User is not allowed to update this budgetItem.");
            }

            return BadRequest("budget item not valid.");

        }


        [Route("Budget/{BudgetItemId}")]
        public async Task<IHttpActionResult> deleteBudgetItem(int budgetItemId)
        {
            AppUser user = await userManager.FindByNameAsync(User.Identity.Name);
            BudgetItem item = await db.SelectBudgetItemAsync(budgetItemId);

            if(item.HouseholdId == user.HouseholdId)
            {
                await db.DeleteBudgetItemAsync(budgetItemId);
                return Ok();
            }

            return BadRequest("Not your account to delete.");
        }


        #endregion


        #region Transactions

        [Route("Transactions")]
        public async Task<IHttpActionResult> getTransactions([FromUri]TransactionOptions options)
        {
            // account for nulls
            options = options ?? new TransactionOptions();

            var user = await userManager.FindByNameAsync(User.Identity.Name);
            if (user.HouseholdId.HasValue)
            {
                options.HouseholdId = user.HouseholdId;
            }
            else
            {
                return BadRequest("User needs to be in household to see transactions.");
            }
                
            // NOT USING PAGING FOR NOW.
            List<Transaction> transactions = await db.GetTransactionsAsync(options);

            return Ok(transactions);
        }


        [Route("Transactions/account/{accountId}")]
        public async Task<IHttpActionResult> getTransactionsByAccount(int accountId, int page = 1)
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);

            var acc = await db.SelectAccountAsync(accountId);
            // account could not exist and cause error.

            TransactionOptions options = new TransactionOptions { AccountId = accountId };

            // check user is in same house as account.
            if (user.HouseholdId == acc.HouseholdId)
            {
                // NOT USING PAGING FOR NOW.
                List<Transaction> transactions = await db.GetTransactionsAsync(options);

                return Ok(transactions);
            }

            return BadRequest("user doesn't have access to account.");
        }


        [Route("Transactions/Recent")]
        public async Task<IHttpActionResult> getRecentTransactions()
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);

            if (user.HouseholdId.HasValue)
            {
                List<Transaction> recents = await db.GetRecentTransactionsAsync(user.HouseholdId.Value);
                return Ok(recents);
            }

            return BadRequest("user is not in a household");
        }


        [Route("Transactions")]
        public async Task<IHttpActionResult> postTransaction([FromBody]Transaction tr)
        {
            // check inputs
            if (ModelState.IsValid)
            {
                // set 1 - complete transaction
                AppUser user = await userManager.FindByNameAsync(User.Identity.Name);
                // set missing fields on transaction.
                tr.Updated = DateTime.Now;
                tr.UpdatedByUserId = user.Id;

                // get original transaction or New empty transaction if null.
                Transaction originalTr = null;
                bool isNewTransaction = false;

                if (tr.Id == 0)
                {
                    isNewTransaction = true;
                    originalTr = new Transaction();
                }
                else
                {
                    originalTr = await db.SelectTransactionAsync(tr.Id);
                }


                // set 2 - update account balance
                Account account = await db.SelectAccountAsync(tr.AccountId);
                updateAccountBalances(account, tr, originalTr);


                // set 3 - save transaction and update account.
                if
                   (isNewTransaction) await db.InsertTransactionAsync(tr);
                else
                    await db.UpdateTransactionAsync(tr);

                // save updates to account
                await db.UpdateAccountAsync(account);

                return Ok();
            }

            return BadRequest("transaction is invalid.");
        }


        #endregion



        // HELPERS
        private void updateAccountBalances(Account account, Transaction tr, Transaction originalTr)
        {
            // update balance.   oldValue + X = NewValue, solve for x.
            account.Balance += BalanceChange(tr) - BalanceChange(originalTr);
            account.ReconciledBalance += ReconcileChange(tr) - ReconcileChange(originalTr);
        }

        private decimal BalanceChange(Transaction tr)
        {
            return (tr.IsDeposit) ? tr.Amount : -tr.Amount;
        }

        private decimal ReconcileChange(Transaction tr)
        {
            if (!tr.Reconciled)
                return 0;
            else
                return BalanceChange(tr);
        }
    }
}
