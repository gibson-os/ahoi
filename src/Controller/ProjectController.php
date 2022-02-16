<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Controller;

use Exception;
use GibsonOS\Core\Attribute\CheckPermission;
use GibsonOS\Core\Attribute\GetModel;
use GibsonOS\Core\Controller\AbstractController;
use GibsonOS\Core\Exception\CreateError;
use GibsonOS\Core\Exception\FactoryError;
use GibsonOS\Core\Exception\GetError;
use GibsonOS\Core\Exception\MapperException;
use GibsonOS\Core\Exception\Model\DeleteError;
use GibsonOS\Core\Exception\Model\SaveError;
use GibsonOS\Core\Exception\Repository\SelectError;
use GibsonOS\Core\Exception\SetError;
use GibsonOS\Core\Mapper\ObjectMapper;
use GibsonOS\Core\Model\User\Permission;
use GibsonOS\Core\Service\Response\AjaxResponse;
use GibsonOS\Module\Ahoi\Dto\Navigation;
use GibsonOS\Module\Ahoi\Exception\ProjectException;
use GibsonOS\Module\Ahoi\Model\Project;
use GibsonOS\Module\Ahoi\Repository\ProjectRepository;
use GibsonOS\Module\Ahoi\Service\LayoutService;
use GibsonOS\Module\Ahoi\Service\ProjectService;
use GibsonOS\Module\Ahoi\Store\ProjectItemStore;
use GibsonOS\Module\Ahoi\Store\ProjectStore;
use JsonException;
use ReflectionException;

class ProjectController extends AbstractController
{
    /**
     * @throws SelectError
     * @throws JsonException
     */
    #[CheckPermission(Permission::READ)]
    public function index(
        ProjectRepository $projectRepository,
        ProjectStore $projectStore,
        ProjectItemStore $projectItemStore,
        int $node = null
    ): AjaxResponse {
        if (!empty($node)) {
            $projectItemStore->setProject($projectRepository->getById($node, $this->sessionService->getUserId()));

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
        #[GetModel] Project $project = null
    ): AjaxResponse {
        if ($project === null) {
            $project = new Project();
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

            if ($project->getId() === null) {
                $projectService->create($localPath);
            }
        } catch (SaveError|CreateError|GetError|SetError|ProjectException|Exception $e) {
            $projectRepository->rollback();

            throw $e;
        }

        $projectRepository->commit();

        return $this->returnSuccess($project);
    }

    /**
     * @throws FactoryError
     * @throws MapperException
     * @throws JsonException
     * @throws ReflectionException
     */
    #[CheckPermission(Permission::WRITE)]
    public function saveLayout(
        LayoutService $layoutService,
        ObjectMapper $objectMapper,
        #[GetModel(['id' => 'projectId'])] Project $project,
        string $title,
        string $url,
        string $contentItemId,
        array $navigations
    ): AjaxResponse {
        // @todo template??
        $navigationDtos = [];

        foreach ($navigations as $navigation) {
            $navigationDtos[] = $objectMapper->mapToObject(Navigation::class, $navigation);
        }

        $layout = $layoutService->load($project)
            ->setTitle($title)
            ->setUrl($url)
            ->setContentItemId($contentItemId)
            ->setNavigations($navigationDtos)
        ;
        $layoutService->save($project, $layout);

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
