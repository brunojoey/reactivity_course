using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Domain;
using Application.Activities;
using System;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
  public class ActivitiesController : BaseController
  {
    // Gets all in the list
    [HttpGet]
    public async Task<ActionResult<List<Activity>>> List()
    {
        // Sending a message to our List Query in the Applications Folder
        return await Mediator.Send(new List.Query());
    }

    // Gets the id from this get method. 
    [HttpGet("{id}")]
    [Authorize] // Any request that comes through the Details route, will need to be authorized. Other wise a 401 not authrozized error comes up
    public async Task<ActionResult<Activity>> Details(Guid id)
    {
      // will have access to the id due to the http get parameter
      return await Mediator.Send(new Details.Query{Id = id});
    }

    [HttpPost]
    public async Task<ActionResult<Unit>> Create(Create.Command command)
    {
      return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
    {
      command.Id = id;
      return await Mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Unit>> Delete(Guid id)
    {
      return await Mediator.Send(new Delete.Command {Id = id});
    }
  }
}