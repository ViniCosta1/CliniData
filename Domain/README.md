# CliniData.Domain

## 📋 Visão Geral

A **CliniData.Domain** é a camada central de regras de negócio e lógica de domínio da plataforma CliniData. Esta camada contém as entidades de negócio, regras de validação, serviços de domínio e interfaces que definem o comportamento core do sistema de gestão de saúde.

## 🏗 Arquitetura Domain-Driven Design (DDD)

### Princípios Fundamentais
- **Ubiquitous Language**: Linguagem comum entre desenvolvimento e negócio
- **Bounded Contexts**: Contextos delimitados para diferentes áreas do domínio
- **Aggregates**: Agrupamento de entidades relacionadas
- **Domain Events**: Eventos que representam mudanças importantes no domínio
- **Value Objects**: Objetos imutáveis que representam conceitos do negócio

### Estrutura de Domínio
```
CliniData.Domain/
├── Entities/              # Entidades do domínio
├── ValueObjects/          # Objetos de valor
├── Aggregates/           # Agregados e raízes de agregado
├── Services/             # Serviços de domínio
├── Interfaces/           # Contratos e interfaces
├── Events/               # Eventos de domínio
├── Exceptions/           # Exceções específicas do domínio
├── Specifications/       # Especificações de negócio
└── Enums/               # Enumerações do domínio
```

## 🏥 Bounded Contexts

### 1. Patient Management Context
**Responsabilidade**: Gestão completa dos dados dos pacientes
- **Entidades**: Patient, MedicalHistory, ContactInfo
- **Serviços**: PatientValidationService, MedicalHistoryService
- **Eventos**: PatientRegistered, MedicalHistoryUpdated

### 2. Appointment Context
**Responsabilidade**: Agendamento e gestão de consultas
- **Entidades**: Appointment, Schedule, TimeSlot
- **Serviços**: AppointmentSchedulingService, ConflictDetectionService
- **Eventos**: AppointmentScheduled, AppointmentCancelled, AppointmentCompleted

### 3. Medical Records Context
**Responsabilidade**: Gestão de exames e registros médicos
- **Entidades**: Exam, ExamResult, MedicalDocument
- **Serviços**: ExamValidationService, DiagnosisService
- **Eventos**: ExamRegistered, ResultsAvailable, DiagnosisConfirmed

### 4. Institution Context
**Responsabilidade**: Gestão de instituições e profissionais
- **Entidades**: Institution, Doctor, Specialty
- **Serviços**: CredentialValidationService, InstitutionRegistrationService
- **Eventos**: DoctorRegistered, InstitutionApproved

## 🎯 Entidades Principais

### Patient (Paciente)
```csharp
public class Patient : AggregateRoot
{
    public PatientId Id { get; private set; }
    public PersonalInfo PersonalInfo { get; private set; }
    public ContactInfo ContactInfo { get; private set; }
    public MedicalInfo MedicalInfo { get; private set; }
    public List<MedicalHistory> MedicalHistories { get; private set; }
    
    // Métodos de negócio
    public void UpdatePersonalInfo(PersonalInfo newInfo);
    public void AddMedicalHistory(MedicalHistory history);
    public bool IsEligibleForAppointment();
}
```

### Doctor (Médico)
```csharp
public class Doctor : AggregateRoot
{
    public DoctorId Id { get; private set; }
    public PersonalInfo PersonalInfo { get; private set; }
    public ProfessionalInfo ProfessionalInfo { get; private set; }
    public List<Specialty> Specialties { get; private set; }
    public Schedule Schedule { get; private set; }
    
    // Métodos de negócio
    public void AddSpecialty(Specialty specialty);
    public bool IsAvailableAt(DateTime dateTime);
    public void UpdateSchedule(Schedule newSchedule);
}
```

### Appointment (Consulta)
```csharp
public class Appointment : AggregateRoot
{
    public AppointmentId Id { get; private set; }
    public PatientId PatientId { get; private set; }
    public DoctorId DoctorId { get; private set; }
    public InstitutionId InstitutionId { get; private set; }
    public DateTime ScheduledDateTime { get; private set; }
    public AppointmentStatus Status { get; private set; }
    public AppointmentType Type { get; private set; }
    
    // Métodos de negócio
    public void Schedule(DateTime dateTime);
    public void Cancel(string reason);
    public void Complete(string observations);
    public void Reschedule(DateTime newDateTime);
}
```

### Institution (Instituição)
```csharp
public class Institution : AggregateRoot
{
    public InstitutionId Id { get; private set; }
    public string Name { get; private set; }
    public Address Address { get; private set; }
    public ContactInfo ContactInfo { get; private set; }
    public List<Doctor> Doctors { get; private set; }
    public InstitutionType Type { get; private set; }
    
    // Métodos de negócio
    public void RegisterDoctor(Doctor doctor);
    public void UpdateContactInfo(ContactInfo contactInfo);
    public bool HasDoctor(DoctorId doctorId);
}
```

## 💎 Value Objects

### PersonalInfo
```csharp
public class PersonalInfo : ValueObject
{
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public DateTime BirthDate { get; private set; }
    public Gender Gender { get; private set; }
    public CPF CPF { get; private set; }
    
    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return FirstName;
        yield return LastName;
        yield return BirthDate;
        yield return Gender;
        yield return CPF;
    }
}
```

### Address
```csharp
public class Address : ValueObject
{
    public string Street { get; private set; }
    public string Number { get; private set; }
    public string Complement { get; private set; }
    public string Neighborhood { get; private set; }
    public string City { get; private set; }
    public string State { get; private set; }
    public string ZipCode { get; private set; }
    
    public bool IsValid() => !string.IsNullOrEmpty(Street) && 
                            !string.IsNullOrEmpty(City) &&
                            !string.IsNullOrEmpty(State);
}
```

### CPF
```csharp
public class CPF : ValueObject
{
    public string Value { get; private set; }
    
    public CPF(string value)
    {
        if (!IsValid(value))
            throw new InvalidCPFException(value);
        Value = FormatCPF(value);
    }
    
    private static bool IsValid(string cpf)
    {
        // Implementação da validação de CPF
    }
}
```

## 🔧 Serviços de Domínio

### AppointmentSchedulingService
```csharp
public class AppointmentSchedulingService : IDomainService
{
    public async Task<Appointment> ScheduleAppointmentAsync(
        PatientId patientId,
        DoctorId doctorId,
        DateTime requestedDateTime,
        AppointmentType type)
    {
        // Validar disponibilidade do médico
        var doctor = await _doctorRepository.GetByIdAsync(doctorId);
        if (!doctor.IsAvailableAt(requestedDateTime))
            throw new DoctorNotAvailableException(doctorId, requestedDateTime);
        
        // Verificar conflitos
        var conflicts = await _appointmentRepository
            .GetConflictingAppointmentsAsync(doctorId, requestedDateTime);
        
        if (conflicts.Any())
            throw new AppointmentConflictException(conflicts);
        
        // Criar consulta
        var appointment = Appointment.Schedule(patientId, doctorId, requestedDateTime, type);
        
        // Publicar evento
        appointment.AddDomainEvent(new AppointmentScheduledEvent(appointment.Id));
        
        return appointment;
    }
}
```

### PatientValidationService
```csharp
public class PatientValidationService : IDomainService
{
    public ValidationResult ValidatePatientRegistration(Patient patient)
    {
        var result = new ValidationResult();
        
        // Validar informações pessoais
        if (!patient.PersonalInfo.IsValid())
            result.AddError("Informações pessoais inválidas");
        
        // Validar CPF único
        if (_patientRepository.ExistsByCPF(patient.PersonalInfo.CPF))
            result.AddError("CPF já cadastrado no sistema");
        
        // Validar idade mínima
        if (patient.PersonalInfo.Age < 18 && !patient.HasLegalGuardian())
            result.AddError("Paciente menor de idade deve ter responsável");
        
        return result;
    }
}
```

## 📢 Domain Events

### AppointmentScheduledEvent
```csharp
public class AppointmentScheduledEvent : DomainEvent
{
    public AppointmentId AppointmentId { get; }
    public PatientId PatientId { get; }
    public DoctorId DoctorId { get; }
    public DateTime ScheduledDateTime { get; }
    
    public AppointmentScheduledEvent(
        AppointmentId appointmentId,
        PatientId patientId,
        DoctorId doctorId,
        DateTime scheduledDateTime)
    {
        AppointmentId = appointmentId;
        PatientId = patientId;
        DoctorId = doctorId;
        ScheduledDateTime = scheduledDateTime;
    }
}
```

### PatientRegisteredEvent
```csharp
public class PatientRegisteredEvent : DomainEvent
{
    public PatientId PatientId { get; }
    public string PatientName { get; }
    public string Email { get; }
    
    public PatientRegisteredEvent(PatientId patientId, string patientName, string email)
    {
        PatientId = patientId;
        PatientName = patientName;
        Email = email;
    }
}
```

## 🔍 Specifications

### PatientEligibilitySpecification
```csharp
public class PatientEligibilitySpecification : Specification<Patient>
{
    private readonly AppointmentType _appointmentType;
    
    public PatientEligibilitySpecification(AppointmentType appointmentType)
    {
        _appointmentType = appointmentType;
    }
    
    public override Expression<Func<Patient, bool>> ToExpression()
    {
        return patient => patient.IsActive &&
                         patient.HasValidInsurance() &&
                         patient.MeetsAgeRequirement(_appointmentType);
    }
}
```

### DoctorAvailabilitySpecification
```csharp
public class DoctorAvailabilitySpecification : Specification<Doctor>
{
    private readonly DateTime _dateTime;
    private readonly Specialty _requiredSpecialty;
    
    public override Expression<Func<Doctor, bool>> ToExpression()
    {
        return doctor => doctor.IsActive &&
                        doctor.Specialties.Contains(_requiredSpecialty) &&
                        doctor.Schedule.IsAvailableAt(_dateTime);
    }
}
```

## ⚠️ Exceções de Domínio

### DomainException (Base)
```csharp
public abstract class DomainException : Exception
{
    protected DomainException(string message) : base(message) { }
    protected DomainException(string message, Exception innerException) 
        : base(message, innerException) { }
}
```

### Exceções Específicas
```csharp
public class InvalidCPFException : DomainException
{
    public string CPF { get; }
    
    public InvalidCPFException(string cpf) 
        : base($"CPF inválido: {cpf}")
    {
        CPF = cpf;
    }
}

public class AppointmentConflictException : DomainException
{
    public List<Appointment> ConflictingAppointments { get; }
    
    public AppointmentConflictException(List<Appointment> conflicts)
        : base("Conflito de horário detectado")
    {
        ConflictingAppointments = conflicts;
    }
}

public class DoctorNotAvailableException : DomainException
{
    public DoctorId DoctorId { get; }
    public DateTime RequestedDateTime { get; }
    
    public DoctorNotAvailableException(DoctorId doctorId, DateTime dateTime)
        : base($"Médico {doctorId} não disponível em {dateTime}")
    {
        DoctorId = doctorId;
        RequestedDateTime = dateTime;
    }
}
```

## 🔗 Interfaces de Repositório

### IPatientRepository
```csharp
public interface IPatientRepository : IRepository<Patient>
{
    Task<Patient> GetByCPFAsync(CPF cpf);
    Task<IEnumerable<Patient>> GetByDoctorAsync(DoctorId doctorId);
    Task<bool> ExistsByCPFAsync(CPF cpf);
    Task<IEnumerable<Patient>> SearchByNameAsync(string name);
}
```

### IAppointmentRepository
```csharp
public interface IAppointmentRepository : IRepository<Appointment>
{
    Task<IEnumerable<Appointment>> GetByPatientAsync(PatientId patientId);
    Task<IEnumerable<Appointment>> GetByDoctorAsync(DoctorId doctorId, DateTime date);
    Task<IEnumerable<Appointment>> GetConflictingAppointmentsAsync(
        DoctorId doctorId, DateTime dateTime);
    Task<IEnumerable<Appointment>> GetByStatusAsync(AppointmentStatus status);
}
```

## 📊 Enumerações

### AppointmentStatus
```csharp
public enum AppointmentStatus
{
    Scheduled = 1,
    Confirmed = 2,
    InProgress = 3,
    Completed = 4,
    Cancelled = 5,
    NoShow = 6
}
```

### AppointmentType
```csharp
public enum AppointmentType
{
    Consultation = 1,
    Examination = 2,
    Surgery = 3,
    FollowUp = 4,
    Emergency = 5
}
```

### InstitutionType
```csharp
public enum InstitutionType
{
    Hospital = 1,
    Clinic = 2,
    Laboratory = 3,
    DiagnosticCenter = 4,
    EmergencyRoom = 5
}
```

## 🧪 Testes de Domínio

### Estrutura de Testes
```
CliniData.Domain.Tests/
├── Entities/             # Testes das entidades
├── ValueObjects/         # Testes dos objetos de valor
├── Services/            # Testes dos serviços de domínio
├── Specifications/      # Testes das especificações
├── Builders/           # Test builders para criação de objetos
└── Fixtures/           # Dados de teste
```

### Exemplo de Teste de Entidade
```csharp
[Fact]
public void Patient_Should_AddMedicalHistory_When_ValidHistory()
{
    // Arrange
    var patient = PatientBuilder.New().Build();
    var history = MedicalHistoryBuilder.New().Build();
    
    // Act
    patient.AddMedicalHistory(history);
    
    // Assert
    patient.MedicalHistories.Should().Contain(history);
    patient.DomainEvents.Should().ContainSingle()
        .Which.Should().BeOfType<MedicalHistoryAddedEvent>();
}
```

## 🔄 Integração com Outras Camadas

### Dependency Inversion
A camada de domínio define interfaces que são implementadas pelas camadas de infraestrutura:

```csharp
// Domain define a interface
public interface IEmailService
{
    Task SendAppointmentConfirmationAsync(Appointment appointment);
}

// Infrastructure implementa
public class EmailService : IEmailService
{
    public async Task SendAppointmentConfirmationAsync(Appointment appointment)
    {
        // Implementação específica de envio de email
    }
}
```

### Event Handling
```csharp
// Domain publica eventos
public class Appointment : AggregateRoot
{
    public void Complete(string observations)
    {
        Status = AppointmentStatus.Completed;
        AddDomainEvent(new AppointmentCompletedEvent(Id, PatientId, DoctorId));
    }
}

// Application/Infrastructure reage aos eventos
public class AppointmentCompletedEventHandler : INotificationHandler<AppointmentCompletedEvent>
{
    public async Task Handle(AppointmentCompletedEvent notification, CancellationToken cancellationToken)
    {
        // Enviar notificação para o paciente
        // Atualizar métricas
        // Agendar follow-up se necessário
    }
}
```

## 📋 Regras de Negócio Principais

### 1. Agendamento de Consultas
- Médico deve estar disponível no horário solicitado
- Paciente não pode ter mais de 3 consultas agendadas simultaneamente
- Consultas de emergência têm prioridade sobre consultas regulares
- Reagendamento só é permitido até 24h antes da consulta

### 2. Cadastro de Pacientes
- CPF deve ser único no sistema
- Menores de 18 anos devem ter responsável cadastrado
- Informações de contato são obrigatórias
- Histórico médico deve ser validado por profissional de saúde

### 3. Gestão de Médicos
- Médicos devem ter CRM válido
- Especialidades devem ser verificadas pelo conselho médico
- Agenda pode ser configurada com intervalos mínimos de 15 minutos
- Médicos podem ter múltiplas especialidades

### 4. Instituições
- CNPJ deve ser único e válido
- Instituições devem ter pelo menos um médico responsável
- Tipos de instituição determinam serviços disponíveis
- Licenças e certificações devem estar válidas

## 🚀 Melhores Práticas

### Design Patterns Utilizados
- **Aggregate Pattern**: Para garantir consistência transacional
- **Factory Pattern**: Para criação complexa de entidades
- **Strategy Pattern**: Para diferentes tipos de validação
- **Observer Pattern**: Para eventos de domínio
- **Specification Pattern**: Para consultas complexas

### Princípios SOLID
- **Single Responsibility**: Cada classe tem uma responsabilidade específica
- **Open/Closed**: Extensível para novos comportamentos sem modificar código existente
- **Liskov Substitution**: Subtipos devem ser substituíveis por seus tipos base
- **Interface Segregation**: Interfaces específicas para cada cliente
- **Dependency Inversion**: Dependência de abstrações, não de implementações

### Guidelines de Desenvolvimento
1. **Rich Domain Model**: Entidades contêm lógica de negócio
2. **Invariants**: Sempre manter estado consistente
3. **Domain Events**: Comunicar mudanças importantes
4. **Value Objects**: Usar para conceitos sem identidade
5. **Specifications**: Para consultas complexas reutilizáveis
