<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Controller;

use GibsonOS\Core\Attribute\CheckPermission;
use GibsonOS\Core\Attribute\GetMappedModel;
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
use GibsonOS\Core\Manager\ModelManager;
use GibsonOS\Core\Mapper\ObjectMapper;
use GibsonOS\Core\Model\User\Permission;
use GibsonOS\Core\Service\Response\AjaxResponse;
use GibsonOS\Module\Ahoi\Dto\Layout\Navigation;
use GibsonOS\Module\Ahoi\Exception\ProjectException;
use GibsonOS\Module\Ahoi\Model\Project;
use GibsonOS\Module\Ahoi\Repository\ProjectRepository;
use GibsonOS\Module\Ahoi\Service\LayoutService;
use GibsonOS\Module\Ahoi\Service\ProjectService;
use GibsonOS\Module\Ahoi\Store\ProjectItemStore;
use GibsonOS\Module\Ahoi\Store\ProjectStore;

class ProjectController extends AbstractController
{
    /**
     * @throws SelectError
     * @throws \JsonException
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
     * @throws DeleteError
     * @throws \JsonException
     */
    #[CheckPermission(Permission::DELETE)]
    public function delete(ModelManager $modelManager, #[GetModel] Project $project): AjaxResponse
    {
        // @todo dateien löschen
        $modelManager->delete($project);

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
        ModelManager $modelManager,
        #[GetMappedModel(mapping: ['dir' => 'localPath', 'transferSessionId' => 'transferSession'])] Project $project,
        bool $onlyForThisUser = false,
    ): AjaxResponse {
        $projectRepository->startTransaction();
        $project->setUserId($onlyForThisUser ? $this->sessionService->getUserId() : null);

        try {
            $modelManager->save($project);

            if ($project->getId() === null) {
                $projectService->create($project->getDir());
            }
        } catch (SaveError|CreateError|GetError|SetError|ProjectException|\Exception $e) {
            $projectRepository->rollback();

            throw $e;
        }

        $projectRepository->commit();

        return $this->returnSuccess($project);
    }

    /**
     * @throws FactoryError
     * @throws MapperException
     * @throws \JsonException
     * @throws \ReflectionException
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
