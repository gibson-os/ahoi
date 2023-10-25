<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Repository;

use GibsonOS\Core\Exception\Repository\SelectError;
use GibsonOS\Core\Repository\AbstractRepository;
use GibsonOS\Module\Ahoi\Model\Project;
use JsonException;
use MDO\Exception\ClientException;
use MDO\Exception\RecordException;
use ReflectionException;

class ProjectRepository extends AbstractRepository
{
    /**
     * @throws SelectError
     * @throws JsonException
     * @throws ClientException
     * @throws RecordException
     * @throws ReflectionException
     */
    public function getById(int $id, int $userId = null): Project
    {
        $userWhere = '';
        $whereParameters = [$id];

        if ($userId !== null) {
            $userWhere = ' AND (`user_id` IS NULL OR `user_id`=?)';
            $whereParameters[] = $userId;
        }

        return $this->fetchOne('`id`=?' . $userWhere, $whereParameters, Project::class);
    }
}
