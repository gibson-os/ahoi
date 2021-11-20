<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Store;

use GibsonOS\Core\Store\AbstractStore;

class ProjectItemStore extends AbstractStore
{
    private int $projectId;

    public function getList(): iterable
    {
        return [[
            'id' => $this->projectId . '_pages',
            'name' => 'Seiten',
            'type' => 'layout',
            'data' => [],
        ], [
            'id' => $this->projectId . '_partials',
            'name' => 'Partials',
            'data' => [],
        ], [
            'id' => $this->projectId . '_explorer',
            'name' => 'Dateien',
            'type' => 'files',
            'leaf' => true,
        ]];
    }

    public function getCount(): int
    {
        return 0;
    }

    public function setProjectId(int $projectId): ProjectItemStore
    {
        $this->projectId = $projectId;

        return $this;
    }
}
