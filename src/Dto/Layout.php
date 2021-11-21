<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Dto;

use JsonSerializable;

class Layout implements JsonSerializable
{
    /**
     * @param Navigation[] $navigations
     * @param Partial[]    $partials
     */
    public function __construct(
        private string $title,
        private string $url,
        private string $contentItemId,
        private array $navigations,
        private array $partials
    ) {
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): Layout
    {
        $this->title = $title;

        return $this;
    }

    public function getUrl(): string
    {
        return $this->url;
    }

    public function setUrl(string $url): Layout
    {
        $this->url = $url;

        return $this;
    }

    public function getContentItemId(): string
    {
        return $this->contentItemId;
    }

    public function setContentItemId(string $contentItemId): Layout
    {
        $this->contentItemId = $contentItemId;

        return $this;
    }

    /**
     * @return Navigation[]
     */
    public function getNavigations(): array
    {
        return $this->navigations;
    }

    /**
     * @param Navigation[] $navigations
     */
    public function setNavigations(array $navigations): Layout
    {
        $this->navigations = $navigations;

        return $this;
    }

    /**
     * @return Partial[]
     */
    public function getPartials(): array
    {
        return $this->partials;
    }

    /**
     * @param Partial[] $partials
     */
    public function setPartials(array $partials): Layout
    {
        $this->partials = $partials;

        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            'title' => $this->getTitle(),
            'url' => $this->getUrl(),
            'content' => ['itemId' => $this->getContentItemId()],
            'navigations' => $this->getNavigations(),
            'partials' => $this->getPartials(),
        ];
    }
}
