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
using CliniData.Domain.Abstractions;

namespace CliniData.Api.Services
{
    public class AuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            AppDbContext context,
            IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
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

            typeof(Paciente).GetProperty("UserId")!.SetValue(paciente, user.Id);

            _context.Paciente.Add(paciente);
            await _context.SaveChangesAsync();

            return (true, "Paciente cadastrado com sucesso!");
        }

        // -------------------------------
        // MÉDICO
        // -------------------------------
        public async Task<(bool Sucesso, string Mensagem)> RegisterMedicoAsync(CriarMedicoDto dto, string password)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                UserRole = UserRole.Medico
            };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
                return (false, string.Join(", ", result.Errors.Select(e => e.Description)));

            var medico = Medico.Criar(
                nome: dto.Nome,
                crm: new CRM(dto.CRM),
                especialidadeMedicaId: dto.EspecialidadeMedicaId,
                telefone: dto.Telefone,
                email: new Email(dto.Email),
                instituicaoId: dto.InstituicaoId
            );

            typeof(Medico).GetProperty("UserId")!.SetValue(medico, user.Id);

            _context.Medico.Add(medico);
            await _context.SaveChangesAsync();

            return (true, "Médico cadastrado com sucesso!");
        }

        // -------------------------------
        // INSTITUIÇÃO
        // -------------------------------
        public async Task<(bool Sucesso, string Mensagem)> RegisterInstituicaoAsync(CriarInstituicaoDto dto, string password)
        {
            var user = new ApplicationUser
            {
                UserName = dto.CNPJ,
                Email = dto.CNPJ, // caso não tenha email próprio
                UserRole = UserRole.Instituicao
            };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
                return (false, string.Join(", ", result.Errors.Select(e => e.Description)));

            var instituicao = new Instituicao(
                nome: dto.Nome,
                cnpj: dto.CNPJ,
                telefone: dto.Telefone,
                rua: dto.Rua,
                numero: dto.Numero,
                bairro: dto.Bairro,
                cidade: dto.Cidade,
                estado: dto.Estado,
                cep: dto.CEP,
                userId: user.Id
            );

            _context.Instituicao.Add(instituicao);
            await _context.SaveChangesAsync();

            return (true, "Instituição cadastrada com sucesso!");
        }

        // -------------------------------
        // LOGIN
        // -------------------------------
        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return null;

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded)
                return null;

            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email!,
                Role = user.UserRole.ToString()
            };
        }

        // -------------------------------
        // TOKEN JWT
        // -------------------------------
        private string GenerateJwtToken(ApplicationUser user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.UserRole.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                new Claim("userId", user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: null,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
