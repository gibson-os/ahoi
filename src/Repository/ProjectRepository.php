<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Repository;

use GibsonOS\Core\Exception\Repository\SelectError;
use GibsonOS\Core\Repository\AbstractRepository;
use GibsonOS\Module\Ahoi\Model\Project;

class ProjectRepository extends AbstractRepository
{
    /**
     * @throws SelectError
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
