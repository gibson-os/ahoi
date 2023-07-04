<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Controller;

use GibsonOS\Core\Attribute\CheckPermission;
use GibsonOS\Core\Controller\AbstractController;
use GibsonOS\Core\Enum\Permission;
use GibsonOS\Core\Service\Response\AjaxResponse;
use GibsonOS\Core\Utility\JsonUtility;

class PageController extends AbstractController
{
    #[CheckPermission([Permission::READ])]
    public function get(
        string $localPath,
    ): AjaxResponse {
        return $this->returnSuccess(JsonUtility::decode(file_get_contents($localPath)));
    }

    #[CheckPermission([Permission::WRITE])]
    public function post(): AjaxResponse
    {
        return $this->returnSuccess();
    }

    #[CheckPermission([Permission::DELETE])]
    public function delete(): AjaxResponse
    {
        return $this->returnSuccess();
    }

    #[CheckPermission([Permission::WRITE])]
    public function postGenerate(): AjaxResponse
    {
        return $this->returnSuccess();
    }
}
