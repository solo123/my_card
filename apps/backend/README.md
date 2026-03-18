# FastAPI 后端

这是与 `design/api.md` 对齐的 FastAPI mock backend，提供统一响应格式、Bearer Token 鉴权、分页列表、文件上传等接口。

## 运行

```bash
cd apps/backend
pip install -r requirements.txt

# 配置数据库（默认值如下，可按需修改）
export DATABASE_URL="postgresql+psycopg://postgres:postgres@127.0.0.1:5432/my_card"

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
