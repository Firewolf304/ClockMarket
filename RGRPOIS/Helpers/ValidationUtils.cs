using System.ComponentModel.DataAnnotations;

namespace RGRPOIS.Helpers.Utils;

public class ValidationUtils
{
    public const string AllowedRegex = "^[a-zA-Z0-9*?_-+=!@#№;]*$";
    public const string AllowedTextRegex = "^[a-zA-Zа-яёА-ЯЁ0-9*?_-+=!@#№; ]*$";
    public const string AllowedRegexMessage = "Name can only contain letters, numbers and spaces";
}
public class AtLeastOneElementDict : ValidationAttribute
{
    protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
    {
        if (value is Dictionary<string, int> dictionary && dictionary.Count > 0)
        {
            return ValidationResult.Success;
        }

        return new ValidationResult("At least one model must be provided.");
    }
}