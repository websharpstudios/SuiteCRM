<?php

namespace ContainerOkGSQxx;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/*
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getApiPlatform_Graphql_Action_EntrypointService extends App_KernelProdContainer
{
    /*
     * Gets the public 'api_platform.graphql.action.entrypoint' shared service.
     *
     * @return \ApiPlatform\Core\GraphQl\Action\EntrypointAction
     */
    public static function do($container, $lazyLoad = true)
    {
        include_once \dirname(__DIR__, 3).'/vendor/api-platform/core/src/GraphQl/Action/EntrypointAction.php';
        include_once \dirname(__DIR__, 3).'/vendor/api-platform/core/src/GraphQl/ExecutorInterface.php';
        include_once \dirname(__DIR__, 3).'/vendor/api-platform/core/src/GraphQl/Executor.php';
        include_once \dirname(__DIR__, 3).'/vendor/api-platform/core/src/GraphQl/Error/ErrorHandlerInterface.php';
        include_once \dirname(__DIR__, 3).'/vendor/api-platform/core/src/GraphQl/Error/ErrorHandler.php';

        return $container->services['api_platform.graphql.action.entrypoint'] = new \ApiPlatform\Core\GraphQl\Action\EntrypointAction(($container->privates['api_platform.graphql.schema_builder'] ?? $container->load('getApiPlatform_Graphql_SchemaBuilderService')), new \ApiPlatform\Core\GraphQl\Executor(), ($container->services['api_platform.graphql.action.graphiql'] ?? $container->load('getApiPlatform_Graphql_Action_GraphiqlService')), ($container->services['api_platform.graphql.action.graphql_playground'] ?? $container->load('getApiPlatform_Graphql_Action_GraphqlPlaygroundService')), ($container->services['.container.private.serializer'] ?? $container->get_Container_Private_SerializerService()), new \ApiPlatform\Core\GraphQl\Error\ErrorHandler(), false, true, false, 'graphql-playground');
    }
}
