<?php

namespace ContainerOkGSQxx;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/*
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getLegacyInstallCommandService extends App_KernelProdContainer
{
    /*
     * Gets the private 'App\Install\Command\LegacyInstallCommand' shared autowired service.
     *
     * @return \App\Install\Command\LegacyInstallCommand
     */
    public static function do($container, $lazyLoad = true)
    {
        include_once \dirname(__DIR__, 3).'/vendor/symfony/console/Command/Command.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Install/Command/BaseCommand.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Install/Command/BaseStepExecutorCommand.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Install/Command/LegacyInstallCommand.php';

        $container->privates['App\\Install\\Command\\LegacyInstallCommand'] = $instance = new \App\Install\Command\LegacyInstallCommand(($container->privates['App\\Install\\LegacyHandler\\InstallHandler'] ?? $container->load('getInstallHandlerService')), ($container->privates['App\\Install\\Service\\Installation\\InstallStepHandler'] ?? $container->load('getInstallStepHandlerService')));

        $instance->setDefaultSessionName('PHPSESSID');
        $instance->setLegacySessionName('LEGACYSESSID');
        $instance->setSession(($container->services['session'] ?? $container->getSessionService()));
        $instance->setAppStringsHandler(($container->privates['App\\Languages\\LegacyHandler\\AppStringsHandler'] ?? $container->load('getAppStringsHandlerService')));
        $instance->setName('suitecrm:app:install');

        return $instance;
    }
}
