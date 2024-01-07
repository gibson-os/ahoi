<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Store;

use GibsonOS\Core\Service\DirService;
use GibsonOS\Core\Service\FileService;
use GibsonOS\Core\Store\AbstractStore;
use GibsonOS\Module\Ahoi\Dto\Layout;
use GibsonOS\Module\Ahoi\Model\Project;
use GibsonOS\Module\Ahoi\Service\LayoutService;
use JsonException;

class ProjectItemStore extends AbstractStore
{
    private Project $project;

    public function __construct(
        private readonly LayoutService $layoutService,
        private readonly DirService $dirService,
        private readonly FileService $fileService,
    ) {
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
            'data' => $this->getPages(
                $this->dirService->addEndSlash($this->project->getDir()) .
                'json' . DIRECTORY_SEPARATOR .
                'content' . DIRECTORY_SEPARATOR,
            ),
        ], [
            'id' => $id . '_partials',
            'name' => 'Partials',
            'data' => $this->getPartials($layout),
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

    private function getPages(string $dir): array
    {
        $pages = [];

        foreach ($this->dirService->getFiles($dir) as $item) {
            $page = [
                'name' => $this->fileService->getFilename($item),
                'type' => 'page',
                'projectId' => $this->project->getId(),
                'localPath' => $item,
            ];

            if (is_dir($item)) {
                $page['data'] = $this->getPages($item);
            } else {
                $page['leaf'] = true;
            }

            $pages[] = $page;
        }

        return $pages;
    }

    private function getPartials(Layout $layout): array
    {
        $partials = [];

        foreach ($layout->getPartials() as $name => $partial) {
            $partials[] = [
                'name' => $name,
                'type' => 'partial',
                'projectId' => $this->project->getId(),
                'leaf' => true,
                'partial' => $partial,
            ];
        }

        return $partials;
    }
}
