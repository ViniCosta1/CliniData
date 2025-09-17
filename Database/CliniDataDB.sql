CREATE TABLE [Paciente] (
  [IdPaciente] INT PRIMARY KEY IDENTITY(1, 1),
  [Nome] VARCHAR(100),
  [DataNascimento] DATE,
  [Sexo] VARCHAR(10),
  [CPF] VARCHAR(14),
  [Telefone] VARCHAR(20),
  [Email] VARCHAR(100),
  [Rua] VARCHAR(100),
  [Numero] VARCHAR(10),
  [Complemento] VARCHAR(30),
  [Bairro] VARCHAR(50),
  [Cidade] VARCHAR(50),
  [Estado] VARCHAR(2),
  [CEP] VARCHAR(10)
)
GO

CREATE TABLE [Medico] (
  [IdMedico] INT PRIMARY KEY IDENTITY(1, 1),
  [Nome] VARCHAR(100),
  [CRM] VARCHAR(20) UNIQUE,
  [EspecialidadeId] INT,
  [Telefone] VARCHAR(20),
  [Email] VARCHAR(100),
  [InstituicaoId] INT
)
GO

CREATE TABLE [Instituicao] (
  [IdInstituicao] INT PRIMARY KEY IDENTITY(1, 1),
  [Nome] VARCHAR(100),
  [CNPJ] VARCHAR(18) UNIQUE,
  [Telefone] VARCHAR(20),
  [Rua] VARCHAR(100),
  [Numero] VARCHAR(10),
  [Bairro] VARCHAR(50),
  [Cidade] VARCHAR(50),
  [Estado] VARCHAR(2),
  [CEP] VARCHAR(10)
)
GO

CREATE TABLE [EspecialidadeMedica] (
  [IdEspecialidade] INT PRIMARY KEY IDENTITY(1, 1),
  [NomeEspecialidade] VARCHAR(100)
)
GO

CREATE TABLE [Consulta] (
  [IdConsulta] INT PRIMARY KEY IDENTITY(1, 1),
  [DataHora] DATETIME,
  [PacienteId] INT,
  [MedicoId] INT,
  [InstituicaoId] INT,
  [Observacao] VARCHAR(500)
)
GO

CREATE TABLE [Exame] (
  [IdExame] INT PRIMARY KEY IDENTITY(1, 1),
  [TipoExame] VARCHAR(100),
  [DataHora] DATETIME,
  [PacienteId] INT,
  [MedicoId] INT,
  [InstituicaoId] INT,
  [Resultado] VARCHAR(500),
  [Observacao] VARCHAR(500)
)
GO

CREATE TABLE [HistoricoMedico] (
  [IdHistorico] INT PRIMARY KEY IDENTITY(1, 1),
  [PacienteId] INT,
  [DataRegistro] DATETIME,
  [Descricao] VARCHAR(500),
  [MedicoId] INT
)
GO

EXEC sp_addextendedproperty
@name = N'Table_Description',
@value = 'O CRM deve ser preenchido no formato XXXXX/XX, sendo único por estado.',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Medico';
GO

ALTER TABLE [Medico] ADD FOREIGN KEY ([EspecialidadeId]) REFERENCES [EspecialidadeMedica] ([IdEspecialidade])
GO

ALTER TABLE [Medico] ADD FOREIGN KEY ([InstituicaoId]) REFERENCES [Instituicao] ([IdInstituicao])
GO

ALTER TABLE [Consulta] ADD FOREIGN KEY ([PacienteId]) REFERENCES [Paciente] ([IdPaciente])
GO

ALTER TABLE [Consulta] ADD FOREIGN KEY ([MedicoId]) REFERENCES [Medico] ([IdMedico])
GO

ALTER TABLE [Consulta] ADD FOREIGN KEY ([InstituicaoId]) REFERENCES [Instituicao] ([IdInstituicao])
GO

ALTER TABLE [Exame] ADD FOREIGN KEY ([PacienteId]) REFERENCES [Paciente] ([IdPaciente])
GO

ALTER TABLE [Exame] ADD FOREIGN KEY ([MedicoId]) REFERENCES [Medico] ([IdMedico])
GO

ALTER TABLE [Exame] ADD FOREIGN KEY ([InstituicaoId]) REFERENCES [Instituicao] ([IdInstituicao])
GO

ALTER TABLE [HistoricoMedico] ADD FOREIGN KEY ([PacienteId]) REFERENCES [Paciente] ([IdPaciente])
GO

ALTER TABLE [HistoricoMedico] ADD FOREIGN KEY ([MedicoId]) REFERENCES [Medico] ([IdMedico])
GO
