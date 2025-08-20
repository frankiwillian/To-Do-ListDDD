using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoList.Application.DTOs;
using TodoList.Application.Services;

namespace TodoList.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var userId = Guid.Parse(User.Identity.Name);
                var tasks = await _taskService.GetAllByUserIdAsync(userId);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            try
            {
                var userId = Guid.Parse(User.Identity.Name);
                var tasks = await _taskService.GetPendingByUserIdAsync(userId);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("completed")]
        public async Task<IActionResult> GetCompleted()
        {
            try
            {
                var userId = Guid.Parse(User.Identity.Name);
                var tasks = await _taskService.GetCompletedByUserIdAsync(userId);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("overdue")]
        public async Task<IActionResult> GetOverdue()
        {
            try
            {
                var userId = Guid.Parse(User.Identity.Name);
                var tasks = await _taskService.GetOverdueByUserIdAsync(userId);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var userId = Guid.Parse(User.Identity.Name);
                var task = await _taskService.GetByIdAsync(id);
                
                if (task == null)
                    return NotFound(new { message = "Tarefa não encontrada" });
                
                if (task.UserId != userId)
                    return Forbid();
                
                return Ok(task);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTaskDto createTaskDto)
        {
            try
            {
                var userId = Guid.Parse(User.Identity.Name);
                var task = await _taskService.CreateAsync(createTaskDto, userId);
                return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTaskDto updateTaskDto)
        {
            try
            {
                var userId = Guid.Parse(User.Identity.Name);
                var task = await _taskService.UpdateAsync(id, updateTaskDto, userId);
                return Ok(task);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}/complete")]
        public async Task<IActionResult> MarkAsCompleted(Guid id)
        {
            try
            {
                var userId = Guid.Parse(User.Identity.Name);
                await _taskService.MarkAsCompletedAsync(id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}/incomplete")]
        public async Task<IActionResult> MarkAsIncomplete(Guid id)
        {
            try
            {
                var userId = Guid.Parse(User.Identity.Name);
                await _taskService.MarkAsIncompleteAsync(id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var userId = Guid.Parse(User.Identity.Name);
                await _taskService.DeleteAsync(id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}