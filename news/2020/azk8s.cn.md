# azk8s.cn 镜像服务已转为仅限 Azure 云内部使用，请立即更换

编辑 `/etc/docker/daemon.json`，新增网易云加速器。

```json
{
  "registry-mirrors": ["https://hub-mirror.c.163.com"]
}
```

详情请查看 [镜像加速器](../docker/content/index?key=install/mirror.md)。
