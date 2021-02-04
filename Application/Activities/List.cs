using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class List
  {
    public class Query : IRequest<List<ActivityDto>> { }

    public class Handler : IRequestHandler<Query, List<ActivityDto>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        _mapper = mapper;
        _context = context;

      }

      public async Task<List<ActivityDto>> Handle(Query request,
        CancellationToken cancellationToken)
      {
        // Will get the activities within the Context, then return it all
        var activities = await _context.Activities
          // this means we are going to get the user activities and go further and return the ap user
          .ToListAsync();

        // From object (Left) To Obejct (Right)
        return _mapper.Map<List<Activity>, List<ActivityDto>>(activities);
      }
    }
  }
}