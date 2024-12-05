using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RGRPOIS.Helpers.Models;
namespace RGRPOIS.Helpers;

public class AppDBContext : DbContext
{
    protected readonly IConfiguration configuration;

    public AppDBContext(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(this.configuration.GetConnectionString("PSQLDatabase"));
    }

    public DbSet<BrandEntity> Brands { get; set; } = null!;
    public DbSet<ProductEntity> Products { get; set; } = null!;
    public DbSet<ModelEntity> Models { get; set; } = null!;
    public DbSet<UserEntity> Users { get; set; } = null!;
    public DbSet<OrderEntity> Orders { get; set; } = null!;
    public DbSet<OrderItemEntity> OrderItems { get; set; } = null!;
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<UserEntity>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<OrderEntity>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId);

        modelBuilder.Entity<OrderEntity>()
            .Property(o => o.Address)
            .HasConversion(
                a => JsonSerializer.Serialize(a,
                    new JsonSerializerOptions { IgnoreNullValues = true }
                ),
                a => JsonSerializer.Deserialize<AddressPurposeEntity>(a,
                    new JsonSerializerOptions { IgnoreNullValues = true }
                )
            );

        modelBuilder.Entity<OrderItemEntity>()
            .HasOne(oi => oi.Model)
            .WithMany(si => si.OrderItems)
            .HasForeignKey(oi => oi.ModelID);

        modelBuilder.Entity<OrderEntity>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItemEntity>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProductEntity>()
            .HasOne(s => s.Brand)
            .WithMany(b => b.Products)
            .HasForeignKey(s => s.BrandId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItemEntity>()
            .HasOne(oi => oi.Model)
            .WithMany(si => si.OrderItems)
            .HasForeignKey(oi => oi.ModelID)
            .OnDelete(DeleteBehavior.Cascade);
    }

}
