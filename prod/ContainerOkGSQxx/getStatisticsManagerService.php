<?php

namespace ContainerOkGSQxx;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/*
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getStatisticsManagerService extends App_KernelProdContainer
{
    /*
     * Gets the private 'App\Statistics\Service\StatisticsManager' shared autowired service.
     *
     * @return \App\Statistics\Service\StatisticsManager
     */
    public static function do($container, $lazyLoad = true)
    {
        include_once \dirname(__DIR__, 3).'/core/backend/Statistics/Service/StatisticsManagerInterface.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Statistics/Service/StatisticsManager.php';

        $container->privates['App\\Statistics\\Service\\StatisticsManager'] = $instance = new \App\Statistics\Service\StatisticsManager(($container->privates['App\\Statistics\\Service\\StatisticsProviderRegistry'] ?? $container->load('getStatisticsProviderRegistryService')));

        $instance->setLogger(($container->privates['monolog.logger'] ?? $container->load('getMonolog_LoggerService')));

        return $instance;
    }
}
