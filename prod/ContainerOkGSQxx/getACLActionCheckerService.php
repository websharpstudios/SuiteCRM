<?php

namespace ContainerOkGSQxx;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/*
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getACLActionCheckerService extends App_KernelProdContainer
{
    /*
     * Gets the private 'App\Engine\Service\ActionAvailabilityChecker\Checkers\ACLActionChecker' shared autowired service.
     *
     * @return \App\Engine\Service\ActionAvailabilityChecker\Checkers\ACLActionChecker
     */
    public static function do($container, $lazyLoad = true)
    {
        include_once \dirname(__DIR__, 3).'/core/backend/Engine/Service/ActionAvailabilityChecker/ActionAvailabilityCheckerInterface.php';
        include_once \dirname(__DIR__, 3).'/core/backend/Engine/Service/ActionAvailabilityChecker/Checkers/ACLActionChecker.php';

        return $container->privates['App\\Engine\\Service\\ActionAvailabilityChecker\\Checkers\\ACLActionChecker'] = new \App\Engine\Service\ActionAvailabilityChecker\Checkers\ACLActionChecker(($container->privates['App\\Engine\\LegacyHandler\\AclHandler'] ?? $container->load('getAclHandlerService')));
    }
}
