<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Service;

use GibsonOS\Core\Exception\CreateError;
use GibsonOS\Core\Exception\GetError;
use GibsonOS\Core\Exception\SetError;
use GibsonOS\Core\Service\DirService;
use GibsonOS\Core\Service\FileService;
use GibsonOS\Module\Ahoi\Exception\ProjectException;

class ProjectService
{
    public function __construct(private DirService $dirService, private FileService $fileService)
    {
    }

    /**
     * @throws CreateError
     * @throws GetError
     * @throws SetError
     * @throws ProjectException
     */
    public function create(string $dir): void
    {
        if (!$this->dirService->isWritable($dir, $this->fileService)) {
            throw new ProjectException(sprintf('Project directory %s is not writable!', $dir));
        }

        $this->fileService->copy(
            realpath(
                dirname(__FILE__) . DIRECTORY_SEPARATOR .
                '..' . DIRECTORY_SEPARATOR .
                '..' . DIRECTORY_SEPARATOR .
                'files' . DIRECTORY_SEPARATOR .
                'emptyProject'
            ),
            $dir
        );
    }
}
