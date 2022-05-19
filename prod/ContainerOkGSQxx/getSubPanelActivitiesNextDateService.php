<?php

namespace ContainerOkGSQxx;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/*
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getSubPanelActivitiesNextDateService extends App_KernelProdContainer
{
    /*
     * Gets the private 'App\Module\Activities\Statistics\Subpanels\SubPanelActivitiesNextDate' shared autowired service.
     *
     * @return \App\Module\Activities\Statistics\Subpanels\SubPanelActivitiesNextDate
     */
    public static function do($container, $lazyLoad = true)
    {
        include_once \dirname(__DIR__, 3).'/core/backend/Data/LegacyHandler/PresetDataHandlers/SubpanelDataQueryHandler.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Statistics/Service/StatisticsProviderInterface.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Statistics/StatisticsHandlingTrait.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Statistics/DateTimeStatisticsHandlingTrait.php';
        include_once \dirname(__DIR__, 3).'/core/modules/Activities/Statistics/Subpanels/SubPanelActivitiesNextDate.php';

        return $container->privates['App\\Module\\Activities\\Statistics\\Subpanels\\SubPanelActivitiesNextDate'] = new \App\Module\Activities\Statistics\Subpanels\SubPanelActivitiesNextDate(\dirname(__DIR__, 3), (\dirname(__DIR__, 3).'/public/legacy'), 'LEGACYSESSID', 'PHPSESSID', ($container->privates['App\\Engine\\LegacyHandler\\LegacyScopeState'] ?? ($container->privates['App\\Engine\\LegacyHandler\\LegacyScopeState'] = new \App\Engine\LegacyHandler\LegacyScopeState())), ($container->privates['App\\Module\\LegacyHandler\\ModuleNameMapperHandler'] ?? $container->getModuleNameMapperHandlerService()), ($container->services['session'] ?? $container->getSessionService()));
    }
}
