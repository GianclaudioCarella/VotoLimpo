using Repository.Pattern.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VotoLimpo.Business.Services
{
    public class PoliticoService
    {
        IRepositoryAsync<Politico> _repo;
        private readonly Repository.Pattern.UnitOfWork.IUnitOfWorkAsync _uow;

        public PoliticoService(
            Repository.Pattern.UnitOfWork.IUnitOfWorkAsync uow,
            IRepositoryAsync<Politico> repo)
        {
            _uow = uow;
            _repo = repo;
        }

        public void GravaPolitico(Politico politico)
        {
            politico.ObjectState = Repository.Pattern.Infrastructure.ObjectState.Added;
            _repo.InsertOrUpdateGraph(politico);
        }

    }
}
