using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
  public class ChatHub : Hub
  {
    private readonly IMediator _mediator;
    public ChatHub(IMediator mediator)
    {
      _mediator = mediator;
    }

    public async Task SendComment(Create.Command command)
    {
      // username from the Hub Context
      string username = GetUsername();

      command.Username = username;

      var comment = await _mediator.Send(command);
      // we want to send this comment to any client that is connected to this hub

      await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment); 
      // .Group sends comments to that specific group in an activity
      // Will ideally go to the AddToGroup method, or go to RemoveFromGroup method
    }

    private string GetUsername()
    {
      return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
    }

    public async Task AddToGroup(string groupName)
    {
      await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

      var username = GetUsername();

      await Clients.Group(groupName).SendAsync("Send", $"{username} has joined the group");
    }

    public async Task RemoveFromGroup(string groupName)
    {
      await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

      var username = GetUsername();

      await Clients.Group(groupName).SendAsync("Send", $"{username} has left the group");
    }
  }
}