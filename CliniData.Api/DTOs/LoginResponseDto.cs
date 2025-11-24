namespace CliniData.Api.DTOs
{
    public class LoginResponseDto
    {
        public string AccessToken { get; set; }
        public string TokenType { get; set; }
        public string Role { get; set; }
    }
}
