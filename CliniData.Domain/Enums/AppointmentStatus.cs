using System;


namespace CliniData.Domain.Enums
{
    public enum AppointmentStatus
    {
        Agendado = 1,
        Confirmado = 2,
        EmProgresso = 3,
        Completo = 4,
        Cancelado = 5,
        NaoCompareceu = 6
    }
}
