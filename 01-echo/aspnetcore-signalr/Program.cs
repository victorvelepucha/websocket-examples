using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapHub<EchoHub>("/echo");

app.Run("http://localhost:3000");

public class EchoHub : Hub
{
    public Task SendMessage(string message) =>
        Clients.Caller.SendAsync("ReceiveMessage", message);
}