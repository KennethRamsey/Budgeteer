using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace FinalTemplate.Models
{
    public class DB
    {
        /// <summary>
        /// get a connection to the database.
        /// </summary>
        /// <returns></returns>
        public static SqlConnection Conn()
        {
            return new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
        }
    }
}