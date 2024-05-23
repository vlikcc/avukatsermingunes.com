using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.BusinessLayer.Concrete;
using guneshukuk.DataAccessLayer.Abstract;
using guneshukuk.DataAccessLayer.Concrete;
using guneshukuk.DataAccessLayer.EntitiyFramework;
using guneshukuk.EntityLayer.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

var builder = WebApplication.CreateBuilder(args);
var requireAuthorizePolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
builder.Services.AddDbContext<GuneshukukContext>();
builder.Services.AddIdentity<AppUser, AppRole>().AddEntityFrameworkStores<GuneshukukContext>();
builder.Services.AddScoped<IBookingDateService, BookingDateManager>();
builder.Services.AddScoped<IBookingDateDal, EfBoookingDateDal>();
builder.Services.AddHttpClient();
builder.Services.AddControllersWithViews();
builder.Services.AddAuthorization(options =>
{
	options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
	options.AddPolicy("RequireEditorRole", policy => policy.RequireRole("Editor"));
	options.AddPolicy("RequireSiteOwnerRole", policy => policy.RequireRole("SiteOwner"));
});

builder.Services.ConfigureApplicationCookie(opt =>
{
    opt.LoginPath = "/Admin/Login/login";
    opt.LogoutPath = "/";
});

// Add services to the container.


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Home/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
	endpoints.MapControllerRoute(
	  name: "areas",
	  pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
	);
});


app.MapControllerRoute(
	name: "default",
	pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
