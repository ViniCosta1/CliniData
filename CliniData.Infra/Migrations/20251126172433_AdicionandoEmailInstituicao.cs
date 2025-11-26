using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CliniData.Infra.Migrations
{
    /// <inheritdoc />
    public partial class AdicionandoEmailInstituicao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "email",
                table: "instituicao",
                type: "text",
                nullable: false,
                defaultValue: "");


            migrationBuilder.CreateIndex(
                name: "ix_consulta_instituicaoid",
                table: "consulta",
                column: "instituicaoid");

            migrationBuilder.CreateIndex(
                name: "ix_consulta_medicoid",
                table: "consulta",
                column: "medicoid");

            migrationBuilder.CreateIndex(
                name: "ix_consulta_pacienteid",
                table: "consulta",
                column: "pacienteid");

            migrationBuilder.AddForeignKey(
                name: "fk_consulta_instituicao_instituicaoid",
                table: "consulta",
                column: "instituicaoid",
                principalTable: "instituicao",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_consulta_medico_medicoid",
                table: "consulta",
                column: "medicoid",
                principalTable: "medico",
                principalColumn: "id_medico",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_consulta_paciente_pacienteid",
                table: "consulta",
                column: "pacienteid",
                principalTable: "paciente",
                principalColumn: "id_paciente",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_consulta_instituicao_instituicaoid",
                table: "consulta");

            migrationBuilder.DropForeignKey(
                name: "fk_consulta_medico_medicoid",
                table: "consulta");

            migrationBuilder.DropForeignKey(
                name: "fk_consulta_paciente_pacienteid",
                table: "consulta");

            migrationBuilder.DropIndex(
                name: "ix_consulta_instituicaoid",
                table: "consulta");

            migrationBuilder.DropIndex(
                name: "ix_consulta_medicoid",
                table: "consulta");

            migrationBuilder.DropIndex(
                name: "ix_consulta_pacienteid",
                table: "consulta");

            migrationBuilder.DropColumn(
                name: "email",
                table: "instituicao");


        }
    }
}
