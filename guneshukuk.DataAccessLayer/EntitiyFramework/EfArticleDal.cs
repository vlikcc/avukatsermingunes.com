using guneshukuk.DataAccessLayer.Abstract;
using guneshukuk.DataAccessLayer.Concrete;
using guneshukuk.DataAccessLayer.Repositories;
using guneshukuk.EntityLayer.Entities;
using Microsoft.Identity.Client;

namespace guneshukuk.DataAccessLayer.EntitiyFramework
{
    public class EfArticleDal : GenericRepository<Article>, IArticleDal
    {
        public EfArticleDal(GuneshukukContext context) : base(context)
        {
            
        }

      
    }
}
