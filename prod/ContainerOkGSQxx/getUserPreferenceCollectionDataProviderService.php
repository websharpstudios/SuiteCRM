<?php

namespace ContainerOkGSQxx;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/*
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getUserPreferenceCollectionDataProviderService extends App_KernelProdContainer
{
    /*
     * Gets the private 'App\UserPreferences\DataProvider\UserPreferenceCollectionDataProvider' shared autowired service.
     *
     * @return \App\UserPreferences\DataProvider\UserPreferenceCollectionDataProvider
     */
    public static function do($container, $lazyLoad = true)
    {
        include_once \dirname(__DIR__, 3).'/vendor/api-platform/core/src/DataProvider/RestrictedDataProviderInterface.php';
        include_once \dirname(__DIR__, 3).'/core/backend/UserPreferences/DataProvider/UserPreferenceCollectionDataProvider.php';

        return $container->privates['App\\UserPreferences\\DataProvider\\UserPreferenceCollectionDataProvider'] = new \App\UserPreferences\DataProvider\UserPreferenceCollectionDataProvider(($container->privates['App\\UserPreferences\\LegacyHandler\\UserPreferenceHandler'] ?? $container->load('getUserPreferenceHandlerService')));
    }
}
