namespace RGRPOIS.Helpers.Utils;

public class ValidationUtils
{
    public const string AllowedRegex = "^[a-zA-Z0-9*?_-+=!@#№;]*$";
    public const string AllowedTextRegex = "^[a-zA-Zа-яёА-ЯЁ0-9*?_-+=!@#№; ]*$";
    public const string AllowedRegexMessage = "Name can only contain letters, numbers and spaces";
}
