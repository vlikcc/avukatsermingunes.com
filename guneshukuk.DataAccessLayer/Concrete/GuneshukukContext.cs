using guneshukuk.EntityLayer.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace guneshukuk.DataAccessLayer.Concrete
{
    public class GuneshukukContext : IdentityDbContext<AppUser, AppRole, int>
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=tcp:guneshukuk.database.windows.net,1433;Initial Catalog=guneshukuk;Persist Security Info=False;User ID=vlikcc;Password=Srmn1931.;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
        }
        public DbSet<About> Abouts { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Consultancy> Consultancies { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<SocialMedia> SocialMedias { get; set; }

        public DbSet<BookingDate> BookingDates { get; set; }

        public DbSet<BookingTime> BookingTimes { get; set; }
    }
}
