using System;
using System.Text;
using System.Threading.Tasks;
using API.Middleware;
using API.SignalR;
using Application.Activities;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureDevelopmentServices(IServiceCollection services)
    {
      services.AddDbContext<DataContext>(opt =>
      {
        opt.UseLazyLoadingProxies();
        opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
      });

      ConfigureServices(services);
    }
    public void ConfigureProductionServices(IServiceCollection services)
    {
      services.AddDbContext<DataContext>(opt =>
      {
        opt.UseLazyLoadingProxies();
        opt.UseMySql(Configuration.GetConnectionString("DefaultConnection"));
      });

      ConfigureServices(services);
    }

    public void ConfigureServices(IServiceCollection services)
    {
      // This replaces services.AddMvc in Netcore 3.0
      services.AddControllers(opt =>
      {
        var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
        opt.Filters.Add(new AuthorizeFilter(policy));
      })
          .AddFluentValidation(cfg =>
          {
            // This looks for all validators in the Create class and registers them.
            cfg.RegisterValidatorsFromAssemblyContaining<Create>();
          });

      // AddIdentityCore because we can add what we need but it will still Identity App User
      var builder = services.AddIdentityCore<AppUser>();
      var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
      identityBuilder.AddEntityFrameworkStores<DataContext>();
      identityBuilder.AddSignInManager<SignInManager<AppUser>>();

      services.AddAuthorization(opt =>
      {
        opt.AddPolicy("IsActivityHost", policy =>
        {
          policy.Requirements.Add(new IsHostRequirement());
        });
      });
      services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));

      // System Clock Security will be contained with this line and shall be able to run the application
      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
          .AddJwtBearer(opt =>
          {
            opt.TokenValidationParameters = new TokenValidationParameters
            {
              ValidateIssuerSigningKey = true,
              IssuerSigningKey = key,
              ValidateAudience = false,
              ValidateIssuer = false,
              ValidateLifetime = true,
              ClockSkew = TimeSpan.Zero // after our token expires, it will redirect to a "You aren't authorized message
            };
            opt.Events = new JwtBearerEvents
            {
              OnMessageReceived = context =>
              {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                // basically checking our token and if it starts with "/chat"
                {
                  context.Token = accessToken;
                }
                return Task.CompletedTask;
              }
            };
          });

      // Allows the API information to get through the CORS block that happens without this. 
      services.AddCors(opt =>
      {
        opt.AddPolicy("CorsPolicy", policy =>
        {
          policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithExposedHeaders("WWW-Authenticate")
            .WithOrigins("http://localhost:3000")
            .AllowCredentials();
        });
      });
      services.AddMediatR(typeof(List.Handler).Assembly);
      services.AddAutoMapper(typeof(List.Handler));
      services.AddSignalR(); // Does not need any additional configurations

      // Will have access when JWT Tokens are injected
      services.AddScoped<IJwtGenerator, JwtGenerator>();
      // Will get the username out of the token and able to use it anywhere when we inject it
      services.AddScoped<IUserAccessor, UserAccessor>();
      services.AddScoped<IPhotoAccessor, PhotoAccessor>();
      services.AddScoped<IProfileReader, ProfileReader>(); // We can inject our ProfileReader in other classes
      services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      app.UseMiddleware<ErrorHandlingMiddleware>();
      if (env.IsDevelopment())
      {
        // Commented out to use our middleware
        // app.UseDeveloperExceptionPage();
      }

      // app.UseHttpsRedirection();

      app.UseDefaultFiles(); // will look in our wwwroot file for an index.html
      app.UseStaticFiles(); // needs to come before UseRouting

      app.UseRouting();
      app.UseCors("CorsPolicy");

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
        endpoints.MapHub<ChatHub>("/chat");
        endpoints.MapFallbackToController("Index", "Fallback");
      });
    }
  }
}
