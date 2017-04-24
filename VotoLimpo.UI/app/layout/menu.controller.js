(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('MenuController', MenuController)

        //TODO MUDAR ESTOS FILTROS
        .filter('nospace', function () {
            return function (value) {
                return (!value) ? '' : value.replace(/ /g, '');
            };
        })
        .filter('humanizeDoc', function () {
            return function (doc) {

                if (!doc) {
                    return;
                }

                if (doc.type === 'directive') {
                    return doc.name.replace(/([A-Z])/g, function ($1) {
                        return '-' + $1.toLowerCase();
                    });
                }
                return doc.label || doc.title || doc.name;
            };
        });

    MenuController.$inject = ['$state', '$timeout', 'routerHelper'];
    /* @ngInject */
    function MenuController($state, $timeout, routerHelper) {
        var vm = this;


        var mainContentArea = document.querySelector('[role="main"]');
        var states = routerHelper.getStates();

        vm.isCurrent = isCurrent;

        vm.selectSection = selectSection;
        vm.toggleSelectSection = toggleSelectSection;
        vm.isSectionSelected = isSectionSelected;
        vm.selectPage = selectPage;

        vm.isOpen = isOpen;
        vm.isSelected = isSelected;
        vm.toggleOpen = toggleOpen;
        vm.autoFocusContent = false;
        vm.focusMainContent = focusMainContent;
        activate();

        function activate() { getNavRoutes(); }
        function focusMainContent($event) {
            // prevent skip link from redirecting
            if ($event) { $event.preventDefault(); }

            $timeout(function () {
                mainContentArea.focus();
            }, 90);

        }
        function getNavRoutes() {

            vm.sections = [
                //{
                //    type:'heading',
                //    name:'Interfaces'
                //},
                //{
                //    type:'toggle',
                //    name:'Reportes'
                //},
                //{
                //    type:'link',
                //    name:'Home'
                //}
            ];

            //rutas sin heading
            var navRoutes = states
                .filter(function (r) {                      //filtra las rutas que tengan setting y navegacion
                    return r.settings && r.settings.nav && !r.settings.heading;
                })
                .sort(function (r1, r2) {                   //ordena por orden de navegacion
                    return r1.settings.nav - r2.settings.nav;
                });

            //rutas con heading  
            //dentro del objeto navRoutesHeading es un encabezado y su valor un array de las rutas 
            //{"NAV-HADING" : [child-route,child-route,...]}
            var navRoutesHeading = states
                .filter(function (r) {                      //filtra las rutas que tengan setting y navegacion
                    return r.settings && r.settings.nav && r.settings.heading;
                }).reduce(function (rv, x) {
                    (rv[x.settings.heading.toUpperCase()] = rv[x.settings.heading.toUpperCase()] || []).push(x);
                    return rv;
                }, {});

            //agrega los links sin heading
            navRoutes.forEach(function (navRoute) {
                navRoute.type = 'link';
                vm.sections.push(navRoute);
            }, vm);

            for (var heading in navRoutesHeading) {
                if (navRoutesHeading.hasOwnProperty(heading)) {
                    vm.sections.push({ name: heading, type: 'heading' });
                    navRoutesHeading[heading].forEach(getSection, navRoutesHeading);

                }
            }

            function getSection(navRoute) {
                navRoute.type = 'link';
                vm.sections.push(navRoute);
            }
        }

        function isCurrent(route) {
            if (!route.title || !$state.current || !$state.current.title) {
                return '';
            }
            var menuName = route.title;
            return $state.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }

        function selectSection(section) {
            vm.openedSection = section;
        }
        function toggleSelectSection(section) {
            vm.openedSection = (vm.openedSection === section ? null : section);
        }


        function selectPage(section, page) {
            vm.currentSection = section;
            vm.currentPage = page;
        }
        function isSelected(page) {
            return vm.currentPage === page;
        }

        function isSectionSelected(section) {
            //var selected = false;
            //var openedSection = menu.openedSection;
            // if (openedSection === section) {
            //     selected = true;
            // }
            // else if (section.children) {
            //     section.children.forEach(function (childSection) {
            //         if (childSection === openedSection) {
            //             selected = true;
            //         }
            //     });
            // }
            // return selected;
            return false;
        }

        function isOpen(section) {
            //return menu.isSectionSelected(section);
            return false;
        }

        function toggleOpen(section) {
            //menu.toggleSelectSection(section);
            return false;
        }



    }
})();
