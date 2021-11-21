<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Dto;

use JsonSerializable;

class Partial implements JsonSerializable
{
    public function jsonSerialize(): array
    {
        return [];
    }
}
