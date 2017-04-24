using Repository.Pattern.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using VotoLimpo.Business;
using VotoLimpo.Business.Services;

namespace VotoLimpo.UI.Controllers
{
    [RoutePrefix("api/Politico")]
    public class PoliticoController : ApiController
    {
        private readonly PoliticoService _srvPolitico;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;

        public PoliticoController(PoliticoService srvPolitico) { _srvPolitico = srvPolitico; }

        public PoliticoController(
            IUnitOfWorkAsync unitOfWorkAsync,
            PoliticoService srvPolitico)
            : base()
        {
            _unitOfWorkAsync = unitOfWorkAsync;
            _srvPolitico = srvPolitico;
        }

        [HttpPost, Route("novo")]
        public void GravaPolitico(Politico politico)
        {
            _srvPolitico.GravaPolitico(politico);
            _unitOfWorkAsync.SaveChanges();
        }

    }
}
