using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class BaseController : ControllerBase
  {
    // Inject MediatR
    private IMediator _mediator;
    // Only accessbile by this class and any classes that derive from this controller
    protected IMediator Mediator => _mediator ?? (_mediator = HttpContext.RequestServices.GetService<IMediator>());
  }
};