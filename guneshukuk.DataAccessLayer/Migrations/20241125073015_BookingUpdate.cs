using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace guneshukuk.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class BookingUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Bookings_BookingDateId",
                table: "Bookings",
                column: "BookingDateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_BookingDates_BookingDateId",
                table: "Bookings",
                column: "BookingDateId",
                principalTable: "BookingDates",
                principalColumn: "BookingDateId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_BookingDates_BookingDateId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_BookingDateId",
                table: "Bookings");
        }
    }
}
