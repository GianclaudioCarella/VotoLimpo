using Repository.Pattern.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace VotoLimpo.Business
{
    public class ObjEntity : IObjectState
    {
        /// <summary>
        /// Representa o estado do objecto <see cref="Repository.Pattern.Infrastructure.ObjectState"/>
        /// </summary>
        [NotMapped]
        public ObjectState ObjectState { get; set; }
    }
}