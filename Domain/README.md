# CliniData.Domain

# CliniData.Domain

## 📋 O que é

A **CliniData.Domain** contém as **regras de negócio** do sistema CliniData. É aqui que ficam as validações, regras e lógicas principais que definem como o sistema deve funcionar.

Pense nesta parte como o "manual de regras" do sistema - por exemplo:
- Como validar se um CPF está correto
- Quando uma consulta pode ser marcada  
- Quais informações são obrigatórias para cadastrar um paciente
- Como calcular a idade de um paciente

## 🏗 Como está organizado

O código está dividido em pastas para facilitar a organização:

```
CliniData.Domain/
├── Entities/              # Modelos principais (Paciente, Médico, Consulta)
├── ValueObjects/          # Pequenos objetos de dados (CPF, Email, Endereço)
├── Services/             # Lógicas de negócio específicas
├── Interfaces/           # Contratos que outras partes devem seguir
├── Events/               # Eventos importantes que acontecem no sistema
├── Exceptions/           # Erros específicos do negócio
├── Specifications/       # Regras de busca complexas
└── Enums/               # Listas de valores fixos (Status, Tipos)
```

### Como funciona na prática
1. **Entities** representam as coisas principais (um paciente, uma consulta)
2. **Services** contêm as regras (como agendar uma consulta)
3. **ValueObjects** são dados pequenos mas importantes (CPF, endereço)
4. **Events** avisam quando algo importante acontece (consulta marcada)

## 🏥 Áreas do Sistema

O sistema está dividido em 4 áreas principais:

### 1. Gestão de Pacientes
**O que faz**: Tudo relacionado aos dados dos pacientes
- **Principais dados**: Patient (modelo do paciente), MedicalHistory (histórico médico)
- **Regras importantes**: 
  - CPF deve ser único no sistema
  - Menores de 18 anos precisam de responsável
  - Informações de contato são obrigatórias
- **Eventos**: Quando um paciente é cadastrado, quando histórico é atualizado

### 2. Gestão de Consultas
**O que faz**: Controla agendamento e realização de consultas
- **Principais dados**: Appointment (consulta), Schedule (agenda), TimeSlot (horário)
- **Regras importantes**:
  - Médico deve estar disponível no horário
  - Não pode ter consultas no mesmo horário
  - Reagendamento só até 24h antes
- **Eventos**: Consulta agendada, cancelada, realizada

### 3. Gestão de Exames
**O que faz**: Organiza exames médicos e resultados
- **Principais dados**: Exam (exame), ExamResult (resultado), MedicalDocument (documento)
- **Regras importantes**:
  - Exames devem ter data e tipo
  - Resultados devem ser validados
  - Fotos devem ter tamanho limitado
- **Eventos**: Exame registrado, resultado disponível

### 4. Gestão de Instituições
**O que faz**: Controla dados de clínicas/hospitais e médicos
- **Principais dados**: Institution (instituição), Doctor (médico), Specialty (especialidade)
- **Regras importantes**:
  - CNPJ deve ser único
  - Médicos devem ter CRM válido
  - Instituições devem ter ao menos um médico
- **Eventos**: Médico cadastrado, instituição aprovada

## 🎯 Modelos Principais (Entities)

### Patient (Paciente)
```csharp
public class Patient  
{
    public string Id { get; private set; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string CPF { get; private set; }
    public DateTime BirthDate { get; private set; }
    public string Email { get; private set; }
    public string Phone { get; private set; }
    public List<MedicalHistory> MedicalHistories { get; private set; }
    
    // Métodos úteis
    public int GetAge() 
    {
        return DateTime.Now.Year - BirthDate.Year;
    }
    
    public bool IsMinor() 
    {
        return GetAge() < 18;
    }
    
    public void AddMedicalHistory(MedicalHistory history)
    {
        // Adiciona histórico médico e valida
        MedicalHistories.Add(history);
    }
}
```

### Doctor (Médico)
```csharp
public class Doctor
{
    public string Id { get; private set; }
    public string Name { get; private set; }
    public string CRM { get; private set; }
    public string Email { get; private set; }
    public List<string> Specialties { get; private set; }
    public Schedule WorkingHours { get; private set; }
    
    // Métodos úteis
    public bool IsAvailableAt(DateTime dateTime)
    {
        // Verifica se o médico está disponível no horário
        return WorkingHours.IsAvailable(dateTime);
    }
    
    public void AddSpecialty(string specialty)
    {
        if (!Specialties.Contains(specialty))
        {
            Specialties.Add(specialty);
        }
    }
}
```

### Appointment (Consulta)
```csharp
public class Appointment
{
    public string Id { get; private set; }
    public string PatientId { get; private set; }
    public string DoctorId { get; private set; }
    public DateTime ScheduledDateTime { get; private set; }
    public AppointmentStatus Status { get; private set; }
    public string Notes { get; private set; }
    
    // Métodos úteis
    public void Cancel(string reason)
    {
        Status = AppointmentStatus.Cancelled;
        Notes = reason;
    }
    
    public void Complete(string observations)
    {
        Status = AppointmentStatus.Completed;
        Notes = observations;
    }
    
    public bool CanBeRescheduled()
    {
        // Só pode reagendar até 24h antes
        return ScheduledDateTime.Subtract(DateTime.Now).TotalHours > 24;
    }
}
```

### Institution (Instituição)
```csharp
public class Institution
{
    public string Id { get; private set; }
    public string Name { get; private set; }
    public string CNPJ { get; private set; }
    public string Address { get; private set; }
    public string Phone { get; private set; }
    public List<Doctor> Doctors { get; private set; }
    public InstitutionType Type { get; private set; } // Hospital, Clínica, etc.
    
    // Métodos úteis
    public void AddDoctor(Doctor doctor)
    {
        if (!Doctors.Any(d => d.CRM == doctor.CRM))
        {
            Doctors.Add(doctor);
        }
    }
    
    public bool HasDoctor(string doctorId)
    {
        return Doctors.Any(d => d.Id == doctorId);
    }
}
```

## 💎 Objetos de Dados Simples (Value Objects)

Estes são objetos pequenos que representam dados importantes mas não são "entidades" principais:

### CPF
```csharp
public class CPF
{
    public string Value { get; private set; }
    
    public CPF(string cpf)
    {
        if (!IsValid(cpf))
        {
            throw new Exception("CPF inválido");
        }
        Value = FormatCPF(cpf); // Remove pontos e traços
    }
    
    private static bool IsValid(string cpf)
    {
        // Remove formatação
        cpf = cpf.Replace(".", "").Replace("-", "");
        
        // Verifica se tem 11 dígitos
        if (cpf.Length != 11) return false;
        
        // Verifica se não são todos iguais (111.111.111-11)
        if (cpf.All(c => c == cpf[0])) return false;
        
        // Aqui entraria a validação completa do CPF
        return true;
    }
    
    private static string FormatCPF(string cpf)
    {
        // Remove formatação e deixa só números
        return cpf.Replace(".", "").Replace("-", "");
    }
}
```

### Email
```csharp
public class Email
{
    public string Value { get; private set; }
    
    public Email(string email)
    {
        if (string.IsNullOrEmpty(email) || !email.Contains("@"))
        {
            throw new Exception("Email inválido");
        }
        Value = email.ToLower().Trim();
    }
}
```

### Address (Endereço)
```csharp
public class Address
{
    public string Street { get; private set; }
    public string Number { get; private set; }
    public string City { get; private set; }
    public string State { get; private set; }
    public string ZipCode { get; private set; }
    
    public Address(string street, string number, string city, string state, string zipCode)
    {
        if (string.IsNullOrEmpty(street)) throw new Exception("Rua é obrigatória");
        if (string.IsNullOrEmpty(city)) throw new Exception("Cidade é obrigatória");
        if (string.IsNullOrEmpty(state)) throw new Exception("Estado é obrigatório");
        
        Street = street;
        Number = number;
        City = city;
        State = state;
        ZipCode = zipCode;
    }
    
    public string GetFullAddress()
    {
        return $"{Street}, {Number}, {City} - {State}, CEP: {ZipCode}";
    }
}
```

## 🔧 Lógicas de Negócio (Services)

### AppointmentService (Serviço de Consultas)
```csharp
public class AppointmentService
{
    public async Task<Appointment> ScheduleAppointment(
        string patientId,
        string doctorId,
        DateTime requestedDateTime)
    {
        // 1. Verificar se o médico existe e está ativo
        var doctor = await GetDoctorById(doctorId);
        if (doctor == null) 
        {
            throw new Exception("Médico não encontrado");
        }
        
        // 2. Verificar se o médico está disponível
        if (!doctor.IsAvailableAt(requestedDateTime))
        {
            throw new Exception("Médico não disponível neste horário");
        }
        
        // 3. Verificar se não há conflitos de horário
        var conflictingAppointments = await GetAppointmentsByDoctorAndTime(doctorId, requestedDateTime);
        if (conflictingAppointments.Any())
        {
            throw new Exception("Já existe consulta agendada neste horário");
        }
        
        // 4. Criar a consulta
        var appointment = new Appointment 
        {
            PatientId = patientId,
            DoctorId = doctorId,
            ScheduledDateTime = requestedDateTime,
            Status = AppointmentStatus.Scheduled
        };
        
        // 5. Salvar no banco de dados
        await SaveAppointment(appointment);
        
        // 6. Enviar notificações
        await SendAppointmentConfirmation(appointment);
        
        return appointment;
    }
}
```

### PatientService (Serviço de Pacientes)
```csharp
public class PatientService
{
    public async Task<Patient> RegisterPatient(Patient patient)
    {
        // 1. Validar dados básicos
        if (string.IsNullOrEmpty(patient.FirstName))
        {
            throw new Exception("Nome é obrigatório");
        }
        
        if (string.IsNullOrEmpty(patient.CPF))
        {
            throw new Exception("CPF é obrigatório");
        }
        
        // 2. Verificar se CPF já existe
        var existingPatient = await GetPatientByCPF(patient.CPF);
        if (existingPatient != null)
        {
            throw new Exception("CPF já cadastrado no sistema");
        }
        
        // 3. Validar se menor de idade tem responsável
        if (patient.IsMinor() && string.IsNullOrEmpty(patient.GuardianName))
        {
            throw new Exception("Paciente menor de idade deve ter responsável");
        }
        
        // 4. Salvar paciente
        await SavePatient(patient);
        
        // 5. Enviar email de boas-vindas
        await SendWelcomeEmail(patient);
        
        return patient;
    }
}
```

## 📢 Eventos do Sistema (Domain Events)

Os eventos servem para avisar outras partes do sistema quando algo importante acontece:

### AppointmentScheduledEvent
```csharp
public class AppointmentScheduledEvent
{
    public string AppointmentId { get; set; }
    public string PatientId { get; set; }
    public string DoctorId { get; set; }
    public DateTime ScheduledDateTime { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public AppointmentScheduledEvent(string appointmentId, string patientId, string doctorId, DateTime scheduledDateTime)
    {
        AppointmentId = appointmentId;
        PatientId = patientId;
        DoctorId = doctorId;
        ScheduledDateTime = scheduledDateTime;
        CreatedAt = DateTime.Now;
    }
}

// Como usar: quando uma consulta é agendada, este evento é disparado
// Outros sistemas podem "escutar" e fazer ações como:
// - Enviar email de confirmação
// - Enviar SMS de lembrete
// - Atualizar agenda do médico
```

### PatientRegisteredEvent
```csharp
public class PatientRegisteredEvent
{
    public string PatientId { get; set; }
    public string PatientName { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public PatientRegisteredEvent(string patientId, string patientName, string email)
    {
        PatientId = patientId;
        PatientName = patientName;
        Email = email;
        CreatedAt = DateTime.Now;
    }
}

// Usado quando um paciente é cadastrado
// Pode disparar ações como:
// - Enviar email de boas-vindas
// - Criar perfil no app móvel
// - Notificar a recepção
```

## ⚠️ Erros Específicos do Negócio

### Erros customizados para o sistema
```csharp
// Erro base para todas as regras de negócio
public class BusinessRuleException : Exception
{
    public BusinessRuleException(string message) : base(message) { }
}

// Erros específicos
public class InvalidCPFException : BusinessRuleException
{
    public InvalidCPFException(string cpf) 
        : base($"CPF inválido: {cpf}") { }
}

public class AppointmentConflictException : BusinessRuleException
{
    public AppointmentConflictException() 
        : base("Já existe consulta agendada neste horário") { }
}

public class DoctorNotAvailableException : BusinessRuleException
{
    public DoctorNotAvailableException(string doctorName, DateTime dateTime)
        : base($"Dr(a). {doctorName} não está disponível em {dateTime:dd/MM/yyyy HH:mm}") { }
}

public class PatientTooYoungException : BusinessRuleException
{
    public PatientTooYoungException() 
        : base("Paciente menor de idade deve ter um responsável") { }
}
```

## 📊 Listas de Valores Fixos (Enums)

### Status da Consulta
```csharp
public enum AppointmentStatus
{
    Scheduled = 1,      // Agendada
    Confirmed = 2,      // Confirmada
    InProgress = 3,     // Em andamento
    Completed = 4,      // Realizada
    Cancelled = 5,      // Cancelada
    NoShow = 6          // Paciente não compareceu
}
```

### Tipo da Consulta
```csharp
public enum AppointmentType
{
    Consultation = 1,   // Consulta normal
    Examination = 2,    // Exame
    Surgery = 3,        // Cirurgia
    FollowUp = 4,       // Retorno
    Emergency = 5       // Emergência
}
```

### Tipo da Instituição
```csharp
public enum InstitutionType
{
    Hospital = 1,           // Hospital
    Clinic = 2,             // Clínica
    Laboratory = 3,         // Laboratório
    DiagnosticCenter = 4,   // Centro de diagnóstico
    EmergencyRoom = 5       // Pronto-socorro
}
```

## 📋 Principais Regras de Negócio

### 1. Regras para Agendamento de Consultas
- Médico deve estar disponível no horário solicitado
- Paciente não pode ter mais de 3 consultas agendadas ao mesmo tempo
- Consultas de emergência têm prioridade sobre consultas normais
- Reagendamento só é permitido até 24 horas antes da consulta
- Consultas aos domingos e feriados só para emergências

### 2. Regras para Cadastro de Pacientes
- CPF deve ser único no sistema (não pode repetir)
- Menores de 18 anos devem ter responsável cadastrado
- Email e telefone são obrigatórios para contato
- Histórico médico deve ser validado por profissional de saúde
- Dados pessoais podem ser atualizados apenas pelo próprio paciente

### 3. Regras para Gestão de Médicos
- Médicos devem ter CRM válido e ativo
- Especialidades devem ser verificadas pelo conselho médico
- Agenda pode ser configurada com intervalos mínimos de 15 minutos
- Médicos podem ter múltiplas especialidades
- Horário de trabalho deve ser respeitado para agendamentos

### 4. Regras para Instituições
- CNPJ deve ser único e válido
- Instituições devem ter pelo menos um médico responsável
- Tipos de instituição determinam quais serviços podem oferecer
- Licenças e certificações devem estar válidas e atualizadas

## 🧪 Como Testar as Regras

### Exemplo de teste de regra de negócio
```csharp
[Test]
public void Patient_Should_ThrowError_When_CPF_Already_Exists()
{
    // Arrange (Preparar)
    var existingPatient = new Patient("João", "123.456.789-00", "joao@email.com");
    var newPatient = new Patient("Maria", "123.456.789-00", "maria@email.com");
    
    // Act & Assert (Executar e Verificar)
    var exception = Assert.Throws<InvalidCPFException>(() => 
    {
        // Simula tentar cadastrar paciente com CPF que já existe
        patientService.RegisterPatient(newPatient);
    });
    
    Assert.AreEqual("CPF já cadastrado no sistema", exception.Message);
}

[Test]
public void Doctor_Should_Not_Be_Available_Outside_Working_Hours()
{
    // Arrange
    var doctor = new Doctor("Dr. Silva", "12345-SP");
    doctor.SetWorkingHours("08:00", "18:00"); // Trabalha das 8h às 18h
    
    var appointmentTime = new DateTime(2023, 12, 15, 20, 0, 0); // 20:00
    
    // Act
    var isAvailable = doctor.IsAvailableAt(appointmentTime);
    
    // Assert
    Assert.IsFalse(isAvailable);
}
```

## 🤝 Dicas para Trabalhar com Domain

### Como adicionar uma nova regra de negócio
1. **Identifique onde a regra se aplica**: Em qual Entity ou Service?
2. **Escreva a regra em português primeiro**: "Pacientes menores de idade precisam de responsável"
3. **Implemente a validação**: Adicione o código que verifica a regra
4. **Crie o erro específico**: Se a regra for violada, lance uma exceção clara
5. **Teste a regra**: Escreva testes para verificar que funciona

### Exemplo prático - Nova regra: "Médico não pode ter mais de 10 consultas por dia"
```csharp
// 1. No modelo Doctor, adicionar método de validação
public class Doctor 
{
    public bool CanScheduleMoreAppointments(DateTime date)
    {
        var appointmentsToday = GetAppointmentsForDate(date);
        return appointmentsToday.Count < 10;
    }
}

// 2. No serviço de agendamento, verificar a regra
public class AppointmentService 
{
    public async Task<Appointment> ScheduleAppointment(...)
    {
        if (!doctor.CanScheduleMoreAppointments(requestedDateTime.Date))
        {
            throw new DoctorAtCapacityException("Médico já tem 10 consultas agendadas para este dia");
        }
        
        // Resto da lógica...
    }
}

// 3. Criar exceção específica
public class DoctorAtCapacityException : BusinessRuleException
{
    public DoctorAtCapacityException(string message) : base(message) { }
}
```

Esta é a base de todo o sistema - as regras definidas aqui garantem que o CliniData funcione corretamente e de acordo com as necessidades médicas!
