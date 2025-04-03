using Microsoft.EntityFrameworkCore;
using MyLevelQuest.API.Models;

namespace MyLevelQuest.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<TaskModel> Tasks { get; set; } 
    }
}