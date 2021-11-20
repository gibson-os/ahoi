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
            'text' => 'Seiten',
            'type' => 'layout',
        ], [
            'id' => $this->projectId . '_partials',
            'text' => 'Partials',
        ], [
            'id' => $this->projectId . '_explorer',
            'text' => 'Dateien',
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
