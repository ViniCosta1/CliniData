using CliniData.Domain.Abstractions;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CliniData.Domain.Entities
{
    [Table("instituicao")]
    public class Instituicao : BaseEntity<int>
    {
        public string Nome { get; private set; }
        public string Cnpj { get; private set; }
        public string Telefone { get; private set; }
        public string Rua { get; private set; }
        public string Numero { get; private set; }
        public string Bairro { get; private set; }
        public string Cidade { get; private set; }
        public string Estado { get; private set; }
        public string Cep { get; private set; }

        // Navegação
        public ICollection<Medico>? Medicos { get; private set; }
        public int UserId { get; private set; }

        protected Instituicao() { }

        public Instituicao(string nome, string cnpj, string telefone, string rua, string numero,
            string bairro, string cidade, string estado, string cep)
        {
            Nome = nome;
            Cnpj = cnpj;
            Telefone = telefone;
            Rua = rua;
            Numero = numero;
            Bairro = bairro;
            Cidade = cidade;
            Estado = estado;
            Cep = cep;
        }

        public void Atualizar(string nome, string telefone, string rua, string numero, string bairro,
            string cidade, string estado, string cep)
        {
            Nome = nome;
            Telefone = telefone;
            Rua = rua;
            Numero = numero;
            Bairro = bairro;
            Cidade = cidade;
            Estado = estado;
            Cep = cep;
        }
    }
}
