<?php
declare(strict_types=1);

namespace GibsonOS\Module\Ahoi\Model;

use GibsonOS\Core\Attribute\Install\Database\Column;
use GibsonOS\Core\Attribute\Install\Database\Table;
use GibsonOS\Core\Model\AbstractModel;
use GibsonOS\Core\Model\User;
use GibsonOS\Module\Transfer\Model\Session;
use JsonSerializable;

#[Table]
class Project extends AbstractModel implements JsonSerializable
{
    #[Column(attributes: [Column::ATTRIBUTE_UNSIGNED], autoIncrement: true)]
    private ?int $id = null;

    #[Column(length: 128)]
    private string $name;

    #[Column(length: 255)]
    private string $dir;

    #[Column(attributes: [Column::ATTRIBUTE_UNSIGNED])]
    private ?int $transferSessionId = null;

    #[Column(length: 255)]
    private ?string $remotePath = null;

    #[Column]
    private ?int $userId = null;

    private ?Session $transferSession = null;

    private ?User $user = null;

    public static function getTableName(): string
    {
        return 'ahoi_project';
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Project
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): Project
    {
        $this->name = $name;

        return $this;
    }

    public function getDir(): string
    {
        return $this->dir;
    }

    public function setDir(string $dir): Project
    {
        $this->dir = $dir;

        return $this;
    }

    public function getTransferSessionId(): ?int
    {
        return $this->transferSessionId;
    }

    public function setTransferSessionId(?int $transferSessionId): Project
    {
        $this->transferSessionId = $transferSessionId;

        return $this;
    }

    public function getRemotePath(): ?string
    {
        return $this->remotePath;
    }

    public function setRemotePath(?string $remotePath): Project
    {
        $this->remotePath = $remotePath;

        return $this;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(?int $userId): Project
    {
        $this->userId = $userId;

        return $this;
    }

    public function getTransferSession(): ?Session
    {
        if ($this->transferSessionId !== null) {
            $this->transferSession = new Session();
            $this->loadForeignRecord($this->transferSession, $this->transferSessionId);
        }

        return $this->transferSession;
    }

    public function setTransferSession(?Session $transferSession): Project
    {
        $this->transferSession = $transferSession;

        return $this;
    }

    public function getUser(): ?User
    {
        if ($this->userId !== null) {
            $this->user = new User();
            $this->loadForeignRecord($this->user, $this->userId);
        }

        return $this->user;
    }

    public function setUser(?User $user): Project
    {
        $this->user = $user;

        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'localPath' => $this->getDir(),
            'remotePath' => $this->getRemotePath(),
            'transferSessionId' => $this->getTransferSessionId(),
        ];
    }
}
