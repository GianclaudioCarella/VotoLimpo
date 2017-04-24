using System;
using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Configuration;
using Repository.Pattern.DataContext;
using VotoLimpo.Business;
using Repository.Pattern.Ef6;
using Repository.Pattern.UnitOfWork;
using VotoLimpo.Business.Services;
using Repository.Pattern.Repositories;
using Microsoft.Practices.ServiceLocation;

namespace VotoLimpo.UI.App_Start
{
    /// <summary>
    /// Specifies the Unity configuration for the main container.
    /// </summary>
    public class UnityConfig
    {
        #region Unity Container
        private static Lazy<IUnityContainer> container = new Lazy<IUnityContainer>(() =>
        {
            var container = new UnityContainer();
            RegisterTypes(container);
            return container;
        });

        /// <summary>
        /// Gets the configured Unity container.
        /// </summary>
        public static IUnityContainer GetConfiguredContainer()
        {
            return container.Value;
        }
        #endregion

        /// <summary>Registers the type mappings with the Unity container.</summary>
        /// <param name="container">The unity container to configure.</param>
        /// <remarks>There is no need to register concrete types such as controllers or API controllers (unless you want to 
        /// change the defaults), as Unity allows resolving a concrete type even if it was not previously registered.</remarks>
        public static void RegisterTypes(IUnityContainer container)
        {
            container

            //CONTEXTO Y UOW
                .RegisterType<IDataContextAsync, votolimpoEntities>(new PerResolveLifetimeManager())
                .RegisterType<IUnitOfWorkAsync, UnitOfWork>(new PerResolveLifetimeManager())

                //REPOS
                .RegisterType<IRepositoryAsync<Politico>, Repository<Politico>>()

                //SERVICIOS
                .RegisterType<PoliticoService, PoliticoService>()

            ;
            //EL SERVICE LOCATOR EXPONE EL CONTENEDOR DE DEPENDENCIAS A OBJETOS
            //QUE POR LA FORMA EN LA QUE SON CREADOS NO UTILIZAR DI, POR EJEMPLO EL ROLEPROVIDER DE ASP.NET
            UnityServiceLocator locator = new UnityServiceLocator(container);
            ServiceLocator.SetLocatorProvider(() => locator);
        }
    }
}
