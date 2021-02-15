using System.Threading.Tasks;
using Application.Followers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // we want this to be a child of the profiles, so we give it a route
    [Route("api/profiles")]
    public class FollowersController : BaseController
    {
        [HttpPost("{username}/follow")]
        public async Task<ActionResult<Unit>> Follow(string username)
        {
            return await Mediator.Send(new Add.Command{Username = username});
        }

        [HttpDelete("{username}/follow")] // deleting the following
        public async Task<ActionResult<Unit>> Unfollow(string username)
        {
            return await Mediator.Send(new Delete.Command{Username = username});
        }
    }
}