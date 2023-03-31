<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Service;

use GibsonOS\Core\Service\DirService;
use GibsonOS\Core\Utility\JsonUtility;
use GibsonOS\Module\Ahoi\Dto\Layout;
use GibsonOS\Module\Ahoi\Dto\Layout\Navigation;
use GibsonOS\Module\Ahoi\Model\Project;
use JsonException;

class LayoutService
{
    public function __construct(private DirService $dirService)
    {
    }

    /**
     * @throws JsonException
     */
    public function load(Project $project): Layout
    {
        $layout = JsonUtility::decode(file_get_contents(
            $this->dirService->addEndSlash($project->getDir()) .
            'json' . DIRECTORY_SEPARATOR .
            'layout.json'
        ));

        $navigations = [];

        foreach ($layout['navigations'] as $navigation) {
            $navigations[] = new Navigation(
                $navigation['itemId'],
                $navigation['startDepth'] ?? 0,
                $navigation['depth'] ?? null
            );
        }

        return new Layout(
            $layout['title'],
            $layout['url'],
            $layout['content']['itemId'],
            $navigations,
            $layout['partials']
        );
    }

    public function save(Project $project, Layout $layout): void
    {
        file_put_contents(
            $this->dirService->addEndSlash($project->getDir()) .
            'content' . DIRECTORY_SEPARATOR .
            'json' . DIRECTORY_SEPARATOR .
            'layout.json',
            JsonUtility::encode($layout)
        );
    }
}
