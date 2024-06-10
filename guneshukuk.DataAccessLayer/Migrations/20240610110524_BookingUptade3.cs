using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace guneshukuk.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class BookingUptade3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailableDates",
                table: "BookingDates");

            migrationBuilder.DropColumn(
                name: "Dates",
                table: "BookingDates");

            migrationBuilder.AddColumn<DateOnly>(
                name: "Date",
                table: "BookingDates",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "BookingDates");

            migrationBuilder.AddColumn<string>(
                name: "AvailableDates",
                table: "BookingDates",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Dates",
                table: "BookingDates",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
