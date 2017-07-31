using Insight.Database.Schema;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseBuilder
{
    class Program
    {
        static void Main(string[] args)
        {

            // This is using Insight SCHEMA, a similar project to help manage all of your database to be used by insight!!!!

            var schema = new SchemaObjectCollection();
            // THIS is where the sql(as a resource) get's loaded.
            schema.Load(Assembly.GetExecutingAssembly());

            // auto create db.
            var DbName = "ramseyk-financial-db";
            var connectionString = "Data Source=.; Database=" + DbName + "; Integrated Security=True";
            SchemaInstaller.CreateDatabase(connectionString);

            // auto install it, or upgrade it.
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var installer = new SchemaInstaller(connection);
                new SchemaEventConsoleLogger().Attach(installer);
                installer.Install(DbName, schema);
            }
        }
    }
}
