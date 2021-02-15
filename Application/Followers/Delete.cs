using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
namespace Application.Followers
{
  public class Delete
  {
    public class Command : IRequest
    {
      // we need the user we will be following
      public string Username { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly IUserAccessor _userAccessor;
      public Handler(DataContext context, IUserAccessor userAccessor)
      {
        _userAccessor = userAccessor;
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        // we want both the users, the one we are following, and the current user
        var observer = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

        var target = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

        if (target == null)
          throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });

        // Check to see if we have an exisiting following
        var following = await _context.Followings.SingleOrDefaultAsync(x => x.ObserverId == observer.Id && x.TargetId == target.Id);

        if (following == null)
          throw new RestException(HttpStatusCode.BadRequest, new { User = "You are not following this user" });

        if (following != null)
        {
          _context.Followings.Remove(following);
        }
        
        var success = await _context.SaveChangesAsync() > 0;

        // Returning to our API Controller. Will return a 200 Ok response. 
        if (success) return Unit.Value;

        throw new Exception("Problem saving changes");
      }
    }

  }
}