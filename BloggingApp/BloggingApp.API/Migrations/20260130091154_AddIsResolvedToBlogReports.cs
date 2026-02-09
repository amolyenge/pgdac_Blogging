using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BloggingApp.API.Migrations
{
    /// <inheritdoc />
    public partial class AddIsResolvedToBlogReports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsResolved",
                table: "BlogReports",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsResolved",
                table: "BlogReports");
        }
    }
}
