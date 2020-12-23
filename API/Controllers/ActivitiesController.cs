using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Domain;
using Application.Activities;
using System;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]

  public class ActivitiesController : ControllerBase
  {
    private readonly IMediator _mediator;
    public ActivitiesController(IMediator mediator)
    {
        // Gets data
      _mediator = mediator;
    }

    // Gets all in the list
    [HttpGet]
    public async Task<ActionResult<List<Activity>>> List()
    {
        // Sending a message to our List Query in the Applications Folder
        return await _mediator.Send(new List.Query());
    }

    // Gets the id from this get method. 
    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> Details(Guid id)
    {
      // will have access to the id due to the http get parameter
      return await _mediator.Send(new Details.Query{Id = id});
    }

    [HttpPost]
    public async Task<ActionResult<Unit>> Create(Create.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
    {
      command.Id = id;
      return await _mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Unit>> Delete(Guid id)
    {
      return await _mediator.Send(new Delete.Command {Id = id});
    }
  }
}