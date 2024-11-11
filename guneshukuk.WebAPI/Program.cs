using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.BusinessLayer.Concrete;
using guneshukuk.DataAccessLayer.Abstract;
using guneshukuk.DataAccessLayer.Concrete;
using guneshukuk.DataAccessLayer.EntitiyFramework;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Service registration
builder.Services.AddDbContext<GuneshukukContext>();
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

builder.Services.AddScoped<IEmailService, EmailManager>();
builder.Services.AddScoped<IAboutService, AboutManager>();
builder.Services.AddScoped<IAboutDal, EfAboutDal>();

builder.Services.AddScoped<IArticleService, ArticleManager>();
builder.Services.AddScoped<IArticleDal, EfArticleDal>();

builder.Services.AddScoped<IBookingService, BookingManager>();
builder.Services.AddScoped<IBookingDal, EfBookingDal>();

builder.Services.AddScoped<IContactService, ContactManager>();
builder.Services.AddScoped<IContactDal, EfContactDal>();

builder.Services.AddScoped<IConsultancyService, ConsultancyManager>();
builder.Services.AddScoped<IConsultancyDal, EfConsultancyDal>();

builder.Services.AddScoped<ISocialMediaService, SocialMediaManager>();
builder.Services.AddScoped<ISocialMediaDal, EfSocialMediaDal>();

builder.Services.AddScoped<IBookingDateService, BookingDateManager>();
builder.Services.AddScoped<IBookingDateDal, EfBoookingDateDal>();

builder.Services.AddScoped<IBookingTimeService, BookingTimeManager>();
builder.Services.AddScoped<IBookingTimeDal, EfBookingTimeDal>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new OpenApiInfo
	{
		Title = "GunesHukuk API",
		Version = "v1",
		Description = "GunesHukuk Web API documentation",
	});
});


builder.Services.AddCors();
builder.Services.AddApplicationInsightsTelemetry(new Microsoft.ApplicationInsights.AspNetCore.Extensions.ApplicationInsightsServiceOptions
{
    ConnectionString = builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"]
});

var app = builder.Build();

// Configure the HTTP request pipeline.

// Swagger Middleware
app.UseSwagger();
app.UseSwaggerUI(c =>
{
	c.SwaggerEndpoint("/swagger/v1/swagger.json", "GunesHukuk API v1");
	c.RoutePrefix = string.Empty; // Ana sayfada Swagger UI'yi kök olarak ayarlamak için
});



app.UseCors(builder => builder.WithOrigins("https://localhost:7108/").AllowAnyHeader());
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();