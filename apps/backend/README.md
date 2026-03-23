# FastAPI 后端

这是与 `design/api.md` 对齐的 FastAPI mock backend，提供统一响应格式、Bearer Token 鉴权、分页列表、文件上传等接口。

## 运行

```bash
cd apps/backend
pip install -r requirements.txt
```

在 **`apps/backend/.env`** 中配置（可参考同目录下的 `.env.example`）。启动时会自动加载；若已在 shell 中 `export` 同名变量，则以 **shell 优先**。

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@127.0.0.1:5432/my_card
JWT_SECRET=your-long-random-secret
# 可选：access 默认 7200 秒，refresh 默认 7 天
# JWT_ACCESS_EXPIRE_SECONDS=7200
# JWT_REFRESH_EXPIRE_SECONDS=604800
```

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## 关键接口

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/wallet/overview`
- `GET /api/cards/list`
- `POST /api/cards/open`
- `GET /api/announcements`
- `POST /api/upload`

## 响应格式

成功：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

列表：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [],
    "total": 0
  }
}
```
