using Jerome.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Jerome.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Prophet> Prophets => Set<Prophet>();

    public DbSet<Question> Questions => Set<Question>();

    public DbSet<Choice> Choices => Set<Choice>();


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();


        modelBuilder.Entity<Prophet>()
            .HasMany(x => x.Questions)
            .WithOne(x => x.Prophet)
            .HasForeignKey(x => x.ProphetId)
            .OnDelete(DeleteBehavior.Cascade);


        modelBuilder.Entity<Question>()
            .HasMany(x => x.Choices)
            .WithOne(x => x.Question)
            .HasForeignKey(x => x.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}