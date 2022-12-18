<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Store;

use GibsonOS\Core\Store\AbstractDatabaseStore;
use GibsonOS\Module\Ahoi\Model\Project;

class ProjectStore extends AbstractDatabaseStore
{
    private ?int $userId = null;

    protected function getModelClassName(): string
    {
        return Project::class;
    }

    protected function addWhere(string $where, array $parameters = []): ProjectStore
    {
        $where = '`user_id` IS NULL';
        $whereParameters = [];

        if ($this->userId !== null) {
            $where .= ' OR `user_id`=?';
            $whereParameters[] = $this->userId;
        }

        return $this->addWhere($where, $whereParameters);
    }

    public function getList(): iterable
    {
        /** @var Project $project */
        foreach (parent::getList() as $project) {
            $data = $project->jsonSerialize();
            $userId = $project->getUserId();
            $data['onlyForThisUser'] = $userId !== null && $userId === $this->userId;
            $data['type'] = 'project';
            $data['projectId'] = $data['id'];

            yield $data;
        }
    }

    public function setUserId(?int $userId): ProjectStore
    {
        $this->userId = $userId;

        return $this;
    }
}
