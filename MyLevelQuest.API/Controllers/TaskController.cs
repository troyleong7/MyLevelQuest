using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class TaskController : ControllerBase
{
    [HttpGet]
    public IActionResult GetTasks()
    {
        return Ok(new { message = "Task list will be returned here" });
    }
}