<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Controller;

use GibsonOS\Core\Attribute\CheckPermission;
use GibsonOS\Core\Controller\AbstractController;
use GibsonOS\Core\Model\User\Permission;
use GibsonOS\Core\Service\Response\AjaxResponse;
use GibsonOS\Core\Utility\JsonUtility;

class PageController extends AbstractController
{
    #[CheckPermission(Permission::READ)]
    public function load(
        string $localPath,
    ): AjaxResponse {
        return $this->returnSuccess(JsonUtility::decode(file_get_contents($localPath)));
    }

    #[CheckPermission(Permission::WRITE)]
    public function save(): AjaxResponse
    {
        return $this->returnSuccess();
    }

    #[CheckPermission(Permission::DELETE)]
    public function delete(): AjaxResponse
    {
        return $this->returnSuccess();
    }

    #[CheckPermission(Permission::WRITE)]
    public function generate(): AjaxResponse
    {
        return $this->returnSuccess();
    }
}
