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
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_BookingTimes_BookingTimeId",
                table: "Bookings");

            migrationBuilder.AlterColumn<int>(
                name: "BookingTimeId",
                table: "Bookings",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_BookingTimes_BookingTimeId",
                table: "Bookings",
                column: "BookingTimeId",
                principalTable: "BookingTimes",
                principalColumn: "BookingTimeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_BookingTimes_BookingTimeId",
                table: "Bookings");

            migrationBuilder.AlterColumn<int>(
                name: "BookingTimeId",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_BookingTimes_BookingTimeId",
                table: "Bookings",
                column: "BookingTimeId",
                principalTable: "BookingTimes",
                principalColumn: "BookingTimeId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
