<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Store;

use GibsonOS\Core\Store\AbstractStore;
use GibsonOS\Module\Ahoi\Model\Project;
use GibsonOS\Module\Ahoi\Service\LayoutService;
use JsonException;

class ProjectItemStore extends AbstractStore
{
    private Project $project;

    public function __construct(private LayoutService $layoutService)
    {
    }

    /**
     * @throws JsonException
     */
    public function getList(): iterable
    {
        $id = $this->project->getId() ?? 0;
        $layout = $this->layoutService->load($this->project);

        return [[
            'id' => $id . '_pages',
            'projectId' => $id,
            'name' => 'Seiten',
            'type' => 'layout',
            'title' => $layout->getTitle(),
            'url' => $layout->getUrl(),
            'contentItemId' => $layout->getContentItemId(),
            'navigations' => $layout->getNavigations(),
            'data' => [],
        ], [
            'id' => $id . '_partials',
            'name' => 'Partials',
            'data' => [],
        ], [
            'id' => $id . '_explorer',
            'name' => 'Dateien',
            'type' => 'files',
            'leaf' => true,
        ]];
    }

    public function getCount(): int
    {
        return 0;
    }

    public function setProject(Project $project): ProjectItemStore
    {
        $this->project = $project;

        return $this;
    }
}
