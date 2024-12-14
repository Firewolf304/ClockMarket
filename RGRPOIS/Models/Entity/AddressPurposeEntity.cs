using System.ComponentModel.DataAnnotations.Schema;

namespace RGRPOIS.Helpers.Models;

[Table("Addresses")]
public class AddressPurposeEntity
{
    public string CountryCode { get; set; } = null!;

    public string State { get; set; } = null!;

    public string City { get; set; } = null!;

    public string? Street { get; set; }

    public string? Building { get; set; }

    public string? Apartment { get; set; }

    public string? ZipCode { get; set; }

    public override string ToString() =>
        string.Join(", ", GetAddressParts().Where(s => !string.IsNullOrEmpty(s)));

    private IEnumerable<string?> GetAddressParts()
    {
        yield return CountryCode;
        yield return State;
        yield return City;
        yield return Street;
        yield return Building;
        yield return Apartment;
        yield return ZipCode;
    }
}
