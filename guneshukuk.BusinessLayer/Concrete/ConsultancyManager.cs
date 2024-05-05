using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.DataAccessLayer.Abstract;
using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.BusinessLayer.Concrete
{
    public class ConsultancyManager : IConsultancyService
    {
        private readonly IConsultancyDal _consultancyDal;

        public ConsultancyManager(IConsultancyDal consultancyDal)
        {
            _consultancyDal = consultancyDal;
        }

        public void TAdd(Consultancy entity)
        {
            _consultancyDal.Add(entity);
        }

        public void TDelete(Consultancy entity)
        {
            _consultancyDal.Delete(entity);
        }

        public List<Consultancy> TGetAll()
        {
            return _consultancyDal.GetAll();
        }

        public Consultancy TGetById(int id)
        {
            return _consultancyDal.GetById(id);
        }

        public void TUpdate(Consultancy entity)
        {
            _consultancyDal.Update(entity);
        }
    }
}
