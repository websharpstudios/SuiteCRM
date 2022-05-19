<?php

namespace ContainerOkGSQxx;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/*
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getLeadDaysOpenService extends App_KernelProdContainer
{
    /*
     * Gets the private 'App\Module\Leads\Statistics\LeadDaysOpen' shared autowired service.
     *
     * @return \App\Module\Leads\Statistics\LeadDaysOpen
     */
    public static function do($container, $lazyLoad = true)
    {
        include_once \dirname(__DIR__, 3).'/core/backend/Statistics/Service/StatisticsProviderInterface.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Statistics/StatisticsHandlingTrait.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Statistics/DateTimeStatisticsHandlingTrait.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Data/LegacyHandler/AuditQueryingTrait.php';
        include_once \dirname(__DIR__, 3).'/core/modules/Leads/Statistics/LeadDaysOpen.php';

        return $container->privates['App\\Module\\Leads\\Statistics\\LeadDaysOpen'] = new \App\Module\Leads\Statistics\LeadDaysOpen(\dirname(__DIR__, 3), (\dirname(__DIR__, 3).'/public/legacy'), 'LEGACYSESSID', 'PHPSESSID', ($container->privates['App\\Engine\\LegacyHandler\\LegacyScopeState'] ?? ($container->privates['App\\Engine\\LegacyHandler\\LegacyScopeState'] = new \App\Engine\LegacyHandler\LegacyScopeState())), ($container->privates['App\\Module\\LegacyHandler\\ModuleNameMapperHandler'] ?? $container->getModuleNameMapperHandlerService()), ($container->services['doctrine.orm.default_entity_manager'] ?? $container->getDoctrine_Orm_DefaultEntityManagerService()), ($container->services['session'] ?? $container->getSessionService()));
    }
}
