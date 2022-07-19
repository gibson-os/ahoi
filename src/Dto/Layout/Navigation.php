<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Dto\Layout;

use JsonSerializable;

class Navigation implements JsonSerializable
{
    public function __construct(private string $itemId, private int $startDepth, private int $depth)
    {
    }

    public function getItemId(): string
    {
        return $this->itemId;
    }

    public function getStartDepth(): int
    {
        return $this->startDepth;
    }

    public function getDepth(): int
    {
        return $this->depth;
    }

    public function jsonSerialize(): array
    {
        return [
            'itemId' => $this->getItemId(),
            'startDepth' => $this->getStartDepth(),
            'depth' => $this->getDepth(),
        ];
    }
}
