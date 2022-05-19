<?php

namespace ContainerOkGSQxx;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/*
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getCopyLegacyAssetsService extends App_KernelProdContainer
{
    /*
     * Gets the private 'App\Install\Command\CopyLegacyAssets' shared autowired service.
     *
     * @return \App\Install\Command\CopyLegacyAssets
     */
    public static function do($container, $lazyLoad = true)
    {
        include_once \dirname(__DIR__, 3).'/vendor/symfony/console/Command/Command.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Install/Command/CopyLegacyAssets.php';

        $container->privates['App\\Install\\Command\\CopyLegacyAssets'] = $instance = new \App\Install\Command\CopyLegacyAssets(NULL, \dirname(__DIR__, 3), (\dirname(__DIR__, 3).'/public/legacy'), $container->parameters['legacy.copy_asset_paths']);

        $instance->setName('scrm:copy-legacy-assets');

        return $instance;
    }
}
