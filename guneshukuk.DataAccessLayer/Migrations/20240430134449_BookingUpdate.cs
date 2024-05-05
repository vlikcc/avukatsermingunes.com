using System;
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
            migrationBuilder.DropPrimaryKey(
                name: "PK_SocialMedia",
                table: "SocialMedia");

            migrationBuilder.DropColumn(
                name: "BookingDate",
                table: "Bookings");

            migrationBuilder.RenameTable(
                name: "SocialMedia",
                newName: "SocialMedias");

            migrationBuilder.AddColumn<int>(
                name: "BookingDateId",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "BookingTimeId",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SocialMedias",
                table: "SocialMedias",
                column: "SocialMediaId");

            migrationBuilder.CreateTable(
                name: "BookingDates",
                columns: table => new
                {
                    BookingDateId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AvailableDate = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingDates", x => x.BookingDateId);
                });

            migrationBuilder.CreateTable(
                name: "BookingTimes",
                columns: table => new
                {
                    BookingTimeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AvailableTime = table.Column<TimeOnly>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingTimes", x => x.BookingTimeId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_BookingDateId",
                table: "Bookings",
                column: "BookingDateId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_BookingTimeId",
                table: "Bookings",
                column: "BookingTimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_BookingDates_BookingDateId",
                table: "Bookings",
                column: "BookingDateId",
                principalTable: "BookingDates",
                principalColumn: "BookingDateId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_BookingTimes_BookingTimeId",
                table: "Bookings",
                column: "BookingTimeId",
                principalTable: "BookingTimes",
                principalColumn: "BookingTimeId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_BookingDates_BookingDateId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_BookingTimes_BookingTimeId",
                table: "Bookings");

            migrationBuilder.DropTable(
                name: "BookingDates");

            migrationBuilder.DropTable(
                name: "BookingTimes");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_BookingDateId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_BookingTimeId",
                table: "Bookings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SocialMedias",
                table: "SocialMedias");

            migrationBuilder.DropColumn(
                name: "BookingDateId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "BookingTimeId",
                table: "Bookings");

            migrationBuilder.RenameTable(
                name: "SocialMedias",
                newName: "SocialMedia");

            migrationBuilder.AddColumn<DateTime>(
                name: "BookingDate",
                table: "Bookings",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_SocialMedia",
                table: "SocialMedia",
                column: "SocialMediaId");
        }
    }
}
