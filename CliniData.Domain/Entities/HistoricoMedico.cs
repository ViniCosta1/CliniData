using CliniData.Domain.Abstractions;
using System;

namespace CliniData.Domain.Entities
{
    public class HistoricoMedico : BaseEntity<int>
    {
        public int PacienteId { get; set; }     // FK para Paciente
        public int MedicoId { get; set; }       // FK para Medico
        public DateTime DataRegistro { get; set; }
        public string Descricao { get; set; } = null!; // varchar(500)

        // Navegação opcional
        public Paciente? Paciente { get; set; }
        public Medico? Medico { get; set; }

        // Construtor vazio necessário para EF
        public HistoricoMedico() { }
    }
}
