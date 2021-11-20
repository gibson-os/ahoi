<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Service;

use GibsonOS\Module\Ahoi\Dto\Layout;
use GibsonOS\Module\Ahoi\Model\Project;

class LayoutService
{
    public function loadLayout(Project $project): Layout
    {
        return new Layout();
//        $project->getDir()
    }
}
