<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Controller;

use GibsonOS\Core\Attribute\CheckPermission;
use GibsonOS\Core\Controller\AbstractController;
use GibsonOS\Core\Exception\Repository\SelectError;
use GibsonOS\Core\Model\User\Permission;
use GibsonOS\Core\Service\Response\AjaxResponse;
use GibsonOS\Module\Ahoi\Store\ProjectStore;

class ProjectController extends AbstractController
{
    /**
     * @throws SelectError
     */
    #[CheckPermission(Permission::READ)]
    public function index(ProjectStore $projectStore, int $node = null): AjaxResponse
    {
        $projectStore->setUserId($this->sessionService->getUserId());

        return $this->returnSuccess($projectStore->getList(), $projectStore->getCount());
    }

    #[CheckPermission(Permission::DELETE)]
    public function delete(): AjaxResponse
    {
        return $this->returnSuccess();
    }

    #[CheckPermission(Permission::WRITE)]
    public function save(): AjaxResponse
    {
        return $this->returnSuccess();
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
