<?php

namespace ContainerOkGSQxx;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/*
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getModuleRegistryHandlerService extends App_KernelProdContainer
{
    /*
     * Gets the private 'App\Module\LegacyHandler\ModuleRegistryHandler' shared autowired service.
     *
     * @return \App\Module\LegacyHandler\ModuleRegistryHandler
     */
    public static function do($container, $lazyLoad = true)
    {
        include_once \dirname(__DIR__, 3).'/core/backend/Module/Service/ModuleRegistryInterface.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Module/LegacyHandler/ModuleRegistryHandler.php';

        return $container->privates['App\\Module\\LegacyHandler\\ModuleRegistryHandler'] = new \App\Module\LegacyHandler\ModuleRegistryHandler(\dirname(__DIR__, 3), (\dirname(__DIR__, 3).'/public/legacy'), 'LEGACYSESSID', 'PHPSESSID', ($container->privates['App\\Engine\\LegacyHandler\\LegacyScopeState'] ?? ($container->privates['App\\Engine\\LegacyHandler\\LegacyScopeState'] = new \App\Engine\LegacyHandler\LegacyScopeState())), $container->parameters['legacy.frontend_excluded_modules'], ($container->services['session'] ?? $container->getSessionService()));
    }
}
