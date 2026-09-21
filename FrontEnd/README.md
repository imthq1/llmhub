# LLMHub Web

Frontend React JSX khởi tạo bằng Vite cho Web Console của LLMHub.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở URL Vite hiển thị trên terminal (mặc định `http://localhost:5173`).

## Scripts

- `npm run dev` — chạy môi trường phát triển.
- `npm run build` — build production vào thư mục `dist/`.
- `npm run preview` — xem thử bản build.
- `npm run lint` — kiểm tra ESLint.

## Cấu trúc

```text
src/
├── app/          # App root, providers và cấu hình cấp ứng dụng
├── assets/       # images, icons, global styles
├── components/   # component tái sử dụng: common, layout, ui
├── constants/    # hằng số ứng dụng
├── features/     # module theo nghiệp vụ (auth, catalog, usage...)
├── hooks/        # custom React hooks
├── layouts/      # khung layout theo khu vực/trang
├── pages/        # page-level components
├── routes/       # định nghĩa và bảo vệ routes
├── services/     # API client, external integrations
├── store/        # global state
├── types/        # JSDoc/types dùng chung
└── utils/        # helper functions
```

Tạo module nghiệp vụ trong `src/features/<feature-name>/`, ví dụ: `features/catalog`, `features/providers`, `features/billing`.
