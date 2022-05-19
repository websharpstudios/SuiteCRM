<?php

namespace ContainerOkGSQxx;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/*
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getSystemConfigHandlerService extends App_KernelProdContainer
{
    /*
     * Gets the private 'App\SystemConfig\LegacyHandler\SystemConfigHandler' shared autowired service.
     *
     * @return \App\SystemConfig\LegacyHandler\SystemConfigHandler
     */
    public static function do($container, $lazyLoad = true)
    {
        include_once \dirname(__DIR__, 3).'/core/backend/SystemConfig/Service/SystemConfigProviderInterface.php';
        include_once \dirname(__DIR__, 3).'/core/backend/SystemConfig/LegacyHandler/SystemConfigHandler.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Routes/LegacyHandler/ClassicViewRoutingExclusionsHandler.php';
        include_once \dirname(__DIR__, 3).'/core/backend/SystemConfig/LegacyHandler/SystemConfigMappers.php';

        $a = ($container->privates['App\\Engine\\LegacyHandler\\LegacyScopeState'] ?? ($container->privates['App\\Engine\\LegacyHandler\\LegacyScopeState'] = new \App\Engine\LegacyHandler\LegacyScopeState()));
        $b = ($container->services['session'] ?? $container->getSessionService());

        return $container->privates['App\\SystemConfig\\LegacyHandler\\SystemConfigHandler'] = new \App\SystemConfig\LegacyHandler\SystemConfigHandler(\dirname(__DIR__, 3), (\dirname(__DIR__, 3).'/public/legacy'), 'LEGACYSESSID', 'PHPSESSID', $a, $container->parameters['legacy.exposed_system_configs'], ($container->privates['App\\Engine\\LegacyHandler\\ActionNameMapperHandler'] ?? $container->getActionNameMapperHandlerService()), ($container->privates['App\\Module\\LegacyHandler\\ModuleNameMapperHandler'] ?? $container->getModuleNameMapperHandlerService()), new \App\Routes\LegacyHandler\ClassicViewRoutingExclusionsHandler(\dirname(__DIR__, 3), (\dirname(__DIR__, 3).'/public/legacy'), 'LEGACYSESSID', 'PHPSESSID', $a, $b), new \App\SystemConfig\LegacyHandler\SystemConfigMappers(new RewindableGenerator(function () use ($container) {
            yield 0 => ($container->privates['App\\SystemConfig\\LegacyHandler\\DateFormatConfigMapper'] ?? $container->load('getDateFormatConfigMapperService'));
            yield 1 => ($container->privates['App\\SystemConfig\\LegacyHandler\\DefaultCurrencyConfigMapper'] ?? $container->load('getDefaultCurrencyConfigMapperService'));
            yield 2 => ($container->privates['App\\SystemConfig\\LegacyHandler\\DefaultModuleConfigMapper'] ?? $container->load('getDefaultModuleConfigMapperService'));
            yield 3 => ($container->privates['App\\SystemConfig\\LegacyHandler\\TimeFormatConfigMapper'] ?? $container->load('getTimeFormatConfigMapperService'));
        }, 4)), ($container->privates['App\\Currency\\LegacyHandler\\CurrencyHandler'] ?? $container->load('getCurrencyHandlerService')), ($container->privates['App\\Install\\LegacyHandler\\InstallHandler'] ?? $container->load('getInstallHandlerService')), $container->parameters['legacy.system_config_key_map'], $container->parameters['legacy.cache_reset_actions'], $container->parameters['themes.navigation_tab_limits'], $container->parameters['module.listview.column_limits'], $container->parameters['module.listview.settings_limits'], $container->parameters['module.listview.actions_limits'], $container->parameters['module.recordview.actions_limits'], $container->parameters['module.listview.line_actions_limits'], $container->parameters['ui'], [], $b, ($container->privates['App\\Navbar\\LegacyHandler\\NavbarHandler'] ?? $container->load('getNavbarHandlerService')));
    }
}
