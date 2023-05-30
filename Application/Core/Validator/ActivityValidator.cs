using Domain;
using FluentValidation;

namespace Application.Core.Validator;

public class ActivityValidator : AbstractValidator<Activity>
{
    public ActivityValidator()
    {
        RuleFor(e => e.Title).NotEmpty().Length(3, 50);
        RuleFor(e => e.Date).NotEmpty();
        RuleFor(e => e.Description).NotEmpty().MaximumLength(500);
        RuleFor(e => e.Category).NotEmpty().Length(3, 50);
        RuleFor(e => e.City).NotEmpty();
        RuleFor(e => e.Venue).NotEmpty();
    }
}
