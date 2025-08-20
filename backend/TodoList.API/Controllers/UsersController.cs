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
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                var result = await _userService.RegisterAsync(createUserDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            try
            {
                var result = await _userService.LoginAsync(userLoginDto);
                if (result == null)
                    return Unauthorized(new { message = "Email ou senha inválidos" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = Guid.Parse(User.Identity.Name);
                var user = await _userService.GetByIdAsync(userId);
                if (user == null)
                    return NotFound(new { message = "Usuário não encontrado" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Update([FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                var userId = Guid.Parse(User.Identity.Name);
                var user = await _userService.UpdateAsync(userId, updateUserDto);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete()
        {
            try
            {
                var userId = Guid.Parse(User.Identity.Name);
                await _userService.DeleteAsync(userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}