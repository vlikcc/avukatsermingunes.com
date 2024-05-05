using guneshukuk.DataAccessLayer.Abstract;
using guneshukuk.DataAccessLayer.Concrete;
using guneshukuk.DataAccessLayer.Repositories;
using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.DataAccessLayer.EntitiyFramework
{
    public class EfConsultancyDal : GenericRepository<Consultancy>, IConsultancyDal
    {
        public EfConsultancyDal(GuneshukukContext context) : base(context)
        {
        }
    }
}
