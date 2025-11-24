namespace CliniData.Api.Utils;
public static class MimeTypes
{
    private static readonly Dictionary<string, string> Mappings = new()
    {
        { ".pdf", "application/pdf" },
        { ".png", "image/png" },
        { ".jpg", "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".txt", "text/plain" },
        { ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
        { ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    };

    public static string GetMimeType(string fileName)
    {
        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        return Mappings.TryGetValue(ext, out var mime) ? mime : "application/octet-stream";
    }
}
