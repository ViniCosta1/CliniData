using CliniData.Api.DTOs;
using CliniData.Domain.Entities;
using CliniData.Domain.Enums;
using CliniData.Domain.ValueObjects;
using CliniData.Infra.Identity;
using CliniData.Infra.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CliniData.Api.Services
{
    public class AuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            AppDbContext context,
            IConfiguration config)
        {
            _userManager = userManager;
            _context = context;
            _config = config;
        }

        // -------------------------------
        // PACIENTE
        // -------------------------------
        public async Task<(bool Sucesso, string Mensagem)> RegisterPacienteAsync(CriarPacienteDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                UserRole = UserRole.Paciente
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return (false, string.Join(", ", result.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, "Paciente");

            var endereco = new Endereco
            {
                Rua = dto.Rua,
                Numero = dto.Numero,
                Complemento = dto.Complemento,
                Bairro = dto.Bairro,
                Cidade = dto.Cidade,
                UF = dto.Estado,
                CEP = dto.CEP
            };

            var paciente = Paciente.Criar(
                nome: dto.Nome,
                dataNascimento: dto.DataNascimento,
                sexo: Enum.Parse<Sexo>(dto.Sexo, ignoreCase: true),
                cpf: new CPF(dto.CPF),
                telefone: dto.Telefone,
                email: new Email(dto.Email),
                endereco: endereco
            );

            // SETA O USERID
            typeof(Paciente).GetProperty("UserId")!.SetValue(paciente, user.Id);

            _context.Paciente.Add(paciente);
            await _context.SaveChangesAsync();

            return (true, "Paciente cadastrado com sucesso!");
        }

        // -------------------------------
        // MÉDICO
        // -------------------------------
        public async Task<(bool Sucesso, string Mensagem)> RegisterMedicoAsync(CriarMedicoDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                UserRole = UserRole.Medico
            };

            var result = await _userManager.CreateAsync(user, dto.Passowrd);
            if (!result.Succeeded)
                return (false, string.Join(", ", result.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, "Medico");  // 🔥 IMPORTANTE

            var medico = Medico.Criar(
                nome: dto.Nome,
                crm: new CRM(dto.CRM),
                especialidadeMedicaId: dto.EspecialidadeMedicaId,
                telefone: dto.Telefone,
                email: new Email(dto.Email)
            );

            // SETA O USERID
            typeof(Medico).GetProperty("UserId")!.SetValue(medico, user.Id);

            _context.Medico.Add(medico);
            await _context.SaveChangesAsync();

            return (true, "Médico cadastrado com sucesso!");
        }

        // -------------------------------
        // INSTITUIÇÃO
        // -------------------------------
        public async Task<(bool Sucesso, string Mensagem)> RegisterInstituicaoAsync(CriarInstituicaoDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                UserRole = UserRole.Instituicao
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return (false, string.Join(", ", result.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, "Instituicao");


            var instituicao = new Instituicao(
                nome: dto.Nome,
                cnpj: dto.CNPJ,
                telefone: dto.Telefone,
                rua: dto.Rua,
                numero: dto.Numero,
                bairro: dto.Bairro,
                cidade: dto.Cidade,
                estado: dto.Estado,
                cep: dto.CEP
            );

            // *** AQUI ESTAVA O ERRO ***
            // SETAR O USERID
            typeof(Instituicao).GetProperty("UserId")!.SetValue(instituicao, user.Id);

            _context.Instituicao.Add(instituicao);
            await _context.SaveChangesAsync();

            return (true, "Instituição cadastrada com sucesso!");
        }
    }
}
