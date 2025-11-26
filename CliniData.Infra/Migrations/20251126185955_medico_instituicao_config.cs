using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CliniData.Infra.Migrations
{
    /// <inheritdoc />
    public partial class medico_instituicao_config : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_medico_instituicao",
                table: "medico_instituicao");

            migrationBuilder.DropIndex(
                name: "IX_medico_instituicao_medicoid",
                table: "medico_instituicao");

            migrationBuilder.AddPrimaryKey(
                name: "PK_medico_instituicao",
                table: "medico_instituicao",
                columns: new[] { "medicoid", "instituicaoid" });

            migrationBuilder.CreateTable(
                name: "instituicaomedico",
                columns: table => new
                {
                    instituicoesid = table.Column<int>(type: "integer", nullable: false),
                    medicosid = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_instituicaomedico", x => new { x.instituicoesid, x.medicosid });
                    table.ForeignKey(
                        name: "fk_instituicaomedico_instituicao_instituicoesid",
                        column: x => x.instituicoesid,
                        principalTable: "instituicao",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_instituicaomedico_medico_medicosid",
                        column: x => x.medicosid,
                        principalTable: "medico",
                        principalColumn: "id_medico",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_medico_instituicao_instituicaoid",
                table: "medico_instituicao",
                column: "instituicaoid");

            migrationBuilder.CreateIndex(
                name: "ix_instituicaomedico_medicosid",
                table: "instituicaomedico",
                column: "medicosid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "instituicaomedico");

            migrationBuilder.DropPrimaryKey(
                name: "PK_medico_instituicao",
                table: "medico_instituicao");

            migrationBuilder.DropIndex(
                name: "ix_medico_instituicao_instituicaoid",
                table: "medico_instituicao");

            migrationBuilder.AddPrimaryKey(
                name: "PK_medico_instituicao",
                table: "medico_instituicao",
                columns: new[] { "instituicaoid", "medicoid" });

            migrationBuilder.CreateIndex(
                name: "IX_medico_instituicao_medicoid",
                table: "medico_instituicao",
                column: "medicoid");
        }
    }
}
