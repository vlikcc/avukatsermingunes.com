using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace guneshukuk.EntityLayer.Dtos.AppUser
{
	public  class AppUserRegisterDto
	{
        public string Name { get; set; }
        public string Surname {get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
		public string ConfirmPassword { get; set; }

	}
}
