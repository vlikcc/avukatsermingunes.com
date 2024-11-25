using guneshukuk.DataAccessLayer.Abstract;
using guneshukuk.DataAccessLayer.Concrete;
using guneshukuk.EntityLayer.Entities;

namespace guneshukuk.DataAccessLayer.Repositories
{
    public class GenericRepository<T> : IGenericDal<T> where T : class
    {
        public readonly GuneshukukContext _context;
        public GenericRepository(GuneshukukContext context)
        {
            _context = context;
        }

        public void Add(T entity)
        {
            _context.Add(entity);
            _context.SaveChanges();
        }

        public void Delete(T entity)
        {
            _context.Remove(entity);
            _context.SaveChanges();

        }

        public List<T> GetAll()
        {
            return _context.Set<T>().ToList();
        }

        public T GetById(int id)
        {
            return _context.Set<T>().Find(id);
        }

        public void Update(T entity)
        {
            _context.Update(entity);
            _context.SaveChanges();
        }

        public IQueryable<Article> GetQueryable()
        {
            return _context.Articles;
        }
    }
}
