<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Dto;

class Navigation implements \JsonSerializable
{
    /**
     * @param array<string, string> $name
     * @param string[]              $keywords
     * @param Navigation[]          $items
     */
    public function __construct(
        private array $name,
        private string $node,
        private array $keywords,
        private array $items,
    ) {
    }

    /**
     * @return string[]
     */
    public function getName(): array
    {
        return $this->name;
    }

    /**
     * @param string[] $name
     */
    public function setName(array $name): void
    {
        $this->name = $name;
    }

    public function getNode(): string
    {
        return $this->node;
    }

    public function setNode(string $node): void
    {
        $this->node = $node;
    }

    /**
     * @return string[]
     */
    public function getKeywords(): array
    {
        return $this->keywords;
    }

    /**
     * @param string[] $keywords
     */
    public function setKeywords(array $keywords): void
    {
        $this->keywords = $keywords;
    }

    /**
     * @return Navigation[]
     */
    public function getItems(): array
    {
        return $this->items;
    }

    /**
     * @param Navigation[] $items
     */
    public function setItems(array $items): void
    {
        $this->items = $items;
    }

    public function jsonSerialize(): array
    {
        return [
            'name' => $this->getName(),
            'node' => $this->getNode(),
            'keywords' => $this->getKeywords(),
            'items' => $this->getItems(),
        ];
    }
}
