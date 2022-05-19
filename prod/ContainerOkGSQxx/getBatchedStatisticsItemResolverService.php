<?php

namespace ContainerOkGSQxx;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/*
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getBatchedStatisticsItemResolverService extends App_KernelProdContainer
{
    /*
     * Gets the private 'App\Statistics\Resolver\BatchedStatisticsItemResolver' shared autowired service.
     *
     * @return \App\Statistics\Resolver\BatchedStatisticsItemResolver
     */
    public static function do($container, $lazyLoad = true)
    {
        include_once \dirname(__DIR__, 3).'/vendor/api-platform/core/src/GraphQl/Resolver/QueryItemResolverInterface.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Statistics/Resolver/BatchedStatisticsItemResolver.php';

        return $container->privates['App\\Statistics\\Resolver\\BatchedStatisticsItemResolver'] = new \App\Statistics\Resolver\BatchedStatisticsItemResolver(($container->privates['App\\Statistics\\Service\\StatisticsManager'] ?? $container->load('getStatisticsManagerService')));
    }
}
