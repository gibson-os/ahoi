<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Controller;

use Exception;
use GibsonOS\Core\Attribute\CheckPermission;
use GibsonOS\Core\Controller\AbstractController;
use GibsonOS\Core\Exception\CreateError;
use GibsonOS\Core\Exception\GetError;
use GibsonOS\Core\Exception\Model\DeleteError;
use GibsonOS\Core\Exception\Model\SaveError;
use GibsonOS\Core\Exception\Repository\SelectError;
use GibsonOS\Core\Exception\SetError;
use GibsonOS\Core\Model\User\Permission;
use GibsonOS\Core\Service\Response\AjaxResponse;
use GibsonOS\Module\Ahoi\Exception\ProjectException;
use GibsonOS\Module\Ahoi\Model\Project;
use GibsonOS\Module\Ahoi\Repository\ProjectRepository;
use GibsonOS\Module\Ahoi\Service\ProjectService;
use GibsonOS\Module\Ahoi\Store\ProjectItemStore;
use GibsonOS\Module\Ahoi\Store\ProjectStore;

class ProjectController extends AbstractController
{
    /**
     * @throws SelectError
     */
    #[CheckPermission(Permission::READ)]
    public function index(ProjectStore $projectStore, ProjectItemStore $projectItemStore, int $node = null): AjaxResponse
    {
        if (!empty($node)) {
            $projectItemStore->setProjectId($node);

            return $this->returnSuccess($projectItemStore->getList());
        }

        $projectStore->setUserId($this->sessionService->getUserId());

        return $this->returnSuccess($projectStore->getList(), $projectStore->getCount());
    }

    /**
     * @throws SelectError
     * @throws DeleteError
     */
    #[CheckPermission(Permission::DELETE)]
    public function delete(ProjectRepository $projectRepository, int $projectId): AjaxResponse
    {
        $project = $projectRepository->getById($projectId, $this->sessionService->getUserId());
        // @todo dateien löschen
        $project->delete();

        return $this->returnSuccess();
    }

    /**
     * @throws SelectError
     * @throws CreateError
     * @throws GetError
     * @throws SaveError
     * @throws SetError
     * @throws ProjectException
     */
    #[CheckPermission(Permission::WRITE)]
    public function save(
        ProjectRepository $projectRepository,
        ProjectService $projectService,
        string $name,
        string $localPath,
        int $transferSession = null,
        string $remotePath = null,
        bool $onlyForThisUser = false,
        int $id = null
    ): AjaxResponse {
        $project = new Project();

        if (!empty($id)) {
            $project = $projectRepository->getById($id, $this->sessionService->getUserId());
        }

        $projectRepository->startTransaction();
        $project
            ->setName($name)
            ->setDir($localPath)
            ->setTransferSessionId($transferSession)
            ->setRemotePath($remotePath)
            ->setUserId($onlyForThisUser ? $this->sessionService->getUserId() : null)
        ;

        try {
            $project->save();

            if (empty($id)) {
                $projectService->create($localPath);
            }
        } catch (SaveError|CreateError|GetError|SetError|ProjectException|Exception $e) {
            $projectRepository->rollback();

            throw $e;
        }

        $projectRepository->commit();

        return $this->returnSuccess($project);
    }

    #[CheckPermission(Permission::WRITE)]
    public function saveLayout(): AjaxResponse
    {
        return $this->returnSuccess();
    }

    #[CheckPermission(Permission::READ)]
    public function pages(): AjaxResponse
    {
        return $this->returnSuccess();
    }

    #[CheckPermission(Permission::MANAGE + Permission::WRITE)]
    public function upload(): AjaxResponse
    {
        return $this->returnSuccess();
    }

    #[CheckPermission(Permission::MANAGE + Permission::WRITE)]
    public function publish(): AjaxResponse
    {
        return $this->returnSuccess();
    }
}
