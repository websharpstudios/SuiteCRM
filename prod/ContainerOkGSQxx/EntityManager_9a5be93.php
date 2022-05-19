<?php

namespace ContainerOkGSQxx;

include_once \dirname(__DIR__, 3).'/vendor/doctrine/persistence/lib/Doctrine/Persistence/ObjectManager.php';
include_once \dirname(__DIR__, 3).'/vendor/doctrine/orm/lib/Doctrine/ORM/EntityManagerInterface.php';
include_once \dirname(__DIR__, 3).'/vendor/doctrine/orm/lib/Doctrine/ORM/EntityManager.php';
class EntityManager_9a5be93 extends \Doctrine\ORM\EntityManager implements \ProxyManager\Proxy\VirtualProxyInterface
{
    private $valueHoldereae35 = null;
    private $initializer2da58 = null;
    private static $publicProperties9ee9c = [
        
    ];
    public function getConnection()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getConnection', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getConnection();
    }
    public function getMetadataFactory()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getMetadataFactory', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getMetadataFactory();
    }
    public function getExpressionBuilder()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getExpressionBuilder', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getExpressionBuilder();
    }
    public function beginTransaction()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'beginTransaction', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->beginTransaction();
    }
    public function getCache()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getCache', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getCache();
    }
    public function transactional($func)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'transactional', array('func' => $func), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->transactional($func);
    }
    public function commit()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'commit', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->commit();
    }
    public function rollback()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'rollback', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->rollback();
    }
    public function getClassMetadata($className)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getClassMetadata', array('className' => $className), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getClassMetadata($className);
    }
    public function createQuery($dql = '')
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'createQuery', array('dql' => $dql), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->createQuery($dql);
    }
    public function createNamedQuery($name)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'createNamedQuery', array('name' => $name), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->createNamedQuery($name);
    }
    public function createNativeQuery($sql, \Doctrine\ORM\Query\ResultSetMapping $rsm)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'createNativeQuery', array('sql' => $sql, 'rsm' => $rsm), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->createNativeQuery($sql, $rsm);
    }
    public function createNamedNativeQuery($name)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'createNamedNativeQuery', array('name' => $name), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->createNamedNativeQuery($name);
    }
    public function createQueryBuilder()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'createQueryBuilder', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->createQueryBuilder();
    }
    public function flush($entity = null)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'flush', array('entity' => $entity), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->flush($entity);
    }
    public function find($className, $id, $lockMode = null, $lockVersion = null)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'find', array('className' => $className, 'id' => $id, 'lockMode' => $lockMode, 'lockVersion' => $lockVersion), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->find($className, $id, $lockMode, $lockVersion);
    }
    public function getReference($entityName, $id)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getReference', array('entityName' => $entityName, 'id' => $id), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getReference($entityName, $id);
    }
    public function getPartialReference($entityName, $identifier)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getPartialReference', array('entityName' => $entityName, 'identifier' => $identifier), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getPartialReference($entityName, $identifier);
    }
    public function clear($entityName = null)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'clear', array('entityName' => $entityName), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->clear($entityName);
    }
    public function close()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'close', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->close();
    }
    public function persist($entity)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'persist', array('entity' => $entity), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->persist($entity);
    }
    public function remove($entity)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'remove', array('entity' => $entity), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->remove($entity);
    }
    public function refresh($entity)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'refresh', array('entity' => $entity), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->refresh($entity);
    }
    public function detach($entity)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'detach', array('entity' => $entity), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->detach($entity);
    }
    public function merge($entity)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'merge', array('entity' => $entity), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->merge($entity);
    }
    public function copy($entity, $deep = false)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'copy', array('entity' => $entity, 'deep' => $deep), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->copy($entity, $deep);
    }
    public function lock($entity, $lockMode, $lockVersion = null)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'lock', array('entity' => $entity, 'lockMode' => $lockMode, 'lockVersion' => $lockVersion), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->lock($entity, $lockMode, $lockVersion);
    }
    public function getRepository($entityName)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getRepository', array('entityName' => $entityName), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getRepository($entityName);
    }
    public function contains($entity)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'contains', array('entity' => $entity), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->contains($entity);
    }
    public function getEventManager()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getEventManager', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getEventManager();
    }
    public function getConfiguration()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getConfiguration', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getConfiguration();
    }
    public function isOpen()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'isOpen', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->isOpen();
    }
    public function getUnitOfWork()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getUnitOfWork', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getUnitOfWork();
    }
    public function getHydrator($hydrationMode)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getHydrator', array('hydrationMode' => $hydrationMode), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getHydrator($hydrationMode);
    }
    public function newHydrator($hydrationMode)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'newHydrator', array('hydrationMode' => $hydrationMode), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->newHydrator($hydrationMode);
    }
    public function getProxyFactory()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getProxyFactory', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getProxyFactory();
    }
    public function initializeObject($obj)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'initializeObject', array('obj' => $obj), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->initializeObject($obj);
    }
    public function getFilters()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'getFilters', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->getFilters();
    }
    public function isFiltersStateClean()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'isFiltersStateClean', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->isFiltersStateClean();
    }
    public function hasFilters()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'hasFilters', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return $this->valueHoldereae35->hasFilters();
    }
    public static function staticProxyConstructor($initializer)
    {
        static $reflection;
        $reflection = $reflection ?? new \ReflectionClass(__CLASS__);
        $instance   = $reflection->newInstanceWithoutConstructor();
        \Closure::bind(function (\Doctrine\ORM\EntityManager $instance) {
            unset($instance->config, $instance->conn, $instance->metadataFactory, $instance->unitOfWork, $instance->eventManager, $instance->proxyFactory, $instance->repositoryFactory, $instance->expressionBuilder, $instance->closed, $instance->filterCollection, $instance->cache);
        }, $instance, 'Doctrine\\ORM\\EntityManager')->__invoke($instance);
        $instance->initializer2da58 = $initializer;
        return $instance;
    }
    protected function __construct(\Doctrine\DBAL\Connection $conn, \Doctrine\ORM\Configuration $config, \Doctrine\Common\EventManager $eventManager)
    {
        static $reflection;
        if (! $this->valueHoldereae35) {
            $reflection = $reflection ?? new \ReflectionClass('Doctrine\\ORM\\EntityManager');
            $this->valueHoldereae35 = $reflection->newInstanceWithoutConstructor();
        \Closure::bind(function (\Doctrine\ORM\EntityManager $instance) {
            unset($instance->config, $instance->conn, $instance->metadataFactory, $instance->unitOfWork, $instance->eventManager, $instance->proxyFactory, $instance->repositoryFactory, $instance->expressionBuilder, $instance->closed, $instance->filterCollection, $instance->cache);
        }, $this, 'Doctrine\\ORM\\EntityManager')->__invoke($this);
        }
        $this->valueHoldereae35->__construct($conn, $config, $eventManager);
    }
    public function & __get($name)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, '__get', ['name' => $name], $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        if (isset(self::$publicProperties9ee9c[$name])) {
            return $this->valueHoldereae35->$name;
        }
        $realInstanceReflection = new \ReflectionClass('Doctrine\\ORM\\EntityManager');
        if (! $realInstanceReflection->hasProperty($name)) {
            $targetObject = $this->valueHoldereae35;
            $backtrace = debug_backtrace(false, 1);
            trigger_error(
                sprintf(
                    'Undefined property: %s::$%s in %s on line %s',
                    $realInstanceReflection->getName(),
                    $name,
                    $backtrace[0]['file'],
                    $backtrace[0]['line']
                ),
                \E_USER_NOTICE
            );
            return $targetObject->$name;
        }
        $targetObject = $this->valueHoldereae35;
        $accessor = function & () use ($targetObject, $name) {
            return $targetObject->$name;
        };
        $backtrace = debug_backtrace(true, 2);
        $scopeObject = isset($backtrace[1]['object']) ? $backtrace[1]['object'] : new \ProxyManager\Stub\EmptyClassStub();
        $accessor = $accessor->bindTo($scopeObject, get_class($scopeObject));
        $returnValue = & $accessor();
        return $returnValue;
    }
    public function __set($name, $value)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, '__set', array('name' => $name, 'value' => $value), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        $realInstanceReflection = new \ReflectionClass('Doctrine\\ORM\\EntityManager');
        if (! $realInstanceReflection->hasProperty($name)) {
            $targetObject = $this->valueHoldereae35;
            $targetObject->$name = $value;
            return $targetObject->$name;
        }
        $targetObject = $this->valueHoldereae35;
        $accessor = function & () use ($targetObject, $name, $value) {
            $targetObject->$name = $value;
            return $targetObject->$name;
        };
        $backtrace = debug_backtrace(true, 2);
        $scopeObject = isset($backtrace[1]['object']) ? $backtrace[1]['object'] : new \ProxyManager\Stub\EmptyClassStub();
        $accessor = $accessor->bindTo($scopeObject, get_class($scopeObject));
        $returnValue = & $accessor();
        return $returnValue;
    }
    public function __isset($name)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, '__isset', array('name' => $name), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        $realInstanceReflection = new \ReflectionClass('Doctrine\\ORM\\EntityManager');
        if (! $realInstanceReflection->hasProperty($name)) {
            $targetObject = $this->valueHoldereae35;
            return isset($targetObject->$name);
        }
        $targetObject = $this->valueHoldereae35;
        $accessor = function () use ($targetObject, $name) {
            return isset($targetObject->$name);
        };
        $backtrace = debug_backtrace(true, 2);
        $scopeObject = isset($backtrace[1]['object']) ? $backtrace[1]['object'] : new \ProxyManager\Stub\EmptyClassStub();
        $accessor = $accessor->bindTo($scopeObject, get_class($scopeObject));
        $returnValue = $accessor();
        return $returnValue;
    }
    public function __unset($name)
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, '__unset', array('name' => $name), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        $realInstanceReflection = new \ReflectionClass('Doctrine\\ORM\\EntityManager');
        if (! $realInstanceReflection->hasProperty($name)) {
            $targetObject = $this->valueHoldereae35;
            unset($targetObject->$name);
            return;
        }
        $targetObject = $this->valueHoldereae35;
        $accessor = function () use ($targetObject, $name) {
            unset($targetObject->$name);
            return;
        };
        $backtrace = debug_backtrace(true, 2);
        $scopeObject = isset($backtrace[1]['object']) ? $backtrace[1]['object'] : new \ProxyManager\Stub\EmptyClassStub();
        $accessor = $accessor->bindTo($scopeObject, get_class($scopeObject));
        $accessor();
    }
    public function __clone()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, '__clone', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        $this->valueHoldereae35 = clone $this->valueHoldereae35;
    }
    public function __sleep()
    {
        $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, '__sleep', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
        return array('valueHoldereae35');
    }
    public function __wakeup()
    {
        \Closure::bind(function (\Doctrine\ORM\EntityManager $instance) {
            unset($instance->config, $instance->conn, $instance->metadataFactory, $instance->unitOfWork, $instance->eventManager, $instance->proxyFactory, $instance->repositoryFactory, $instance->expressionBuilder, $instance->closed, $instance->filterCollection, $instance->cache);
        }, $this, 'Doctrine\\ORM\\EntityManager')->__invoke($this);
    }
    public function setProxyInitializer(\Closure $initializer = null) : void
    {
        $this->initializer2da58 = $initializer;
    }
    public function getProxyInitializer() : ?\Closure
    {
        return $this->initializer2da58;
    }
    public function initializeProxy() : bool
    {
        return $this->initializer2da58 && ($this->initializer2da58->__invoke($valueHoldereae35, $this, 'initializeProxy', array(), $this->initializer2da58) || 1) && $this->valueHoldereae35 = $valueHoldereae35;
    }
    public function isProxyInitialized() : bool
    {
        return null !== $this->valueHoldereae35;
    }
    public function getWrappedValueHolderValue()
    {
        return $this->valueHoldereae35;
    }
}

if (!\class_exists('EntityManager_9a5be93', false)) {
    \class_alias(__NAMESPACE__.'\\EntityManager_9a5be93', 'EntityManager_9a5be93', false);
}
