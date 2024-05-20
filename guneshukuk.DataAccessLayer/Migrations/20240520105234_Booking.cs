using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace guneshukuk.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class Booking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BookingDates",
                table: "BookingDates",
                newName: "AvailableDates");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AvailableDates",
                table: "BookingDates",
                newName: "BookingDates");
        }
    }
}
