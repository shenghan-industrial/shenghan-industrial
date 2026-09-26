# START HERE — DEXOREN 独立站交接说明

> 家具/建材 B2B 独立站，线上地址：https://shenghanindustrial.com
> 本包为完整可编辑源码（不含 node_modules 依赖与 .env.local 密钥，见下文说明）。

## 1. 技术栈

- **Next.js 15**（App Router + Turbopack）— 官方文档：https://nextjs.org/docs
- **React 19** + **TypeScript 5**
- **Tailwind CSS 4** — 官方文档：https://tailwindcss.com/docs
- 多语言：英 / 中 / 西（切换按钮在前台）
- 部署：Cloudflare Pages（配置见 `wrangler.toml`）

## 2. 环境要求

- **Node.js ≥ 20.19**（推荐 20.19.0）— 下载：https://nodejs.org/
- npm（Node 自带）

## 3. 三步跑起来（本地开发）

```bash
# ① 安装依赖（首次，约 1-3 分钟）
npm install

# ② 复制环境变量模板，并按内注释填入你自己的密钥
#    Windows CMD:
copy .env.example .env.local
#    macOS / Linux:
#    cp .env.example .env.local

# ③ 启动开发服务器
npm run dev
# 浏览器打开 http://localhost:3000
```

## 4. 环境变量说明（.env.local）

模板见 `.env.example`，逐项有注释。涉及四类配置：

| 配置 | 用途 | 去哪申请 |
|------|------|----------|
| Turnstile | 前台表单人机验证 | https://dash.cloudflare.com → Turnstile |
| ADMIN / JWT | 后台登录与令牌 | 自己设定（密码用 bcrypt 哈希） |
| Resend | 询盘邮件通知 | https://resend.com |
| LLM / DashScope | AI 翻译、客服、文案 | 按需配置，可暂时留空 |

> 出于安全，原 `.env.local`（含真实密钥）未打入本包。需要原密钥请直接向站点所有者索取。

## 5. 常用命令

```bash
npm run dev     # 开发（热更新，Turbopack）
npm run build   # 生产构建
npm start       # 运行生产构建
npm run lint    # 代码检查
```

## 6. 目录速查

```
app/                  页面路由
  ├─ page.tsx           首页（5 大板块顺序在此）
  ├─ about/ contact/ products/ promotions/ new-arrivals/
  │  services/ rankings/ privacy/ terms/   前台页面
  ├─ admin/ admin-login/                   后台管理
  └─ api/                                 接口（询盘、联系表单等）
components/            UI 组件
  ├─ HeroSection.tsx     首屏轮播
  ├─ TrustBar.tsx        信任指标条（文案硬编码在此）
  ├─ FeatureCards.tsx    "Why Choose Us" 三卡
  └─ ReviewsSection.tsx  客户评价
data/                  站点文案与数据
  ├─ site-content.json   首页文案 / 轮播图 / 品牌信息（改文案首选）
  ├─ products / categories / reviews   产品、分类、评价数据
messages/              界面按钮等多语言文案（en / zh / es.json）
lib/                   工具库（语言切换 LanguageContext、数据 hooks 等）
public/                静态图片资源
.data/                 本地数据存储
middleware.ts          边缘认证守卫
wrangler.toml          Cloudflare Pages 部署配置
```

## 7. 改文案去哪（最常用）

| 想改什么 | 文件 |
|----------|------|
| 首页板块标题 / 副标题 | `data/site-content.json` |
| 首屏轮播图片 | `data/site-content.json` → `hero.slides` |
| "Why Choose Us" 三张卡 | `data/site-content.json` → `featureCards` |
| 按钮文字（如 Request Quote） | `messages/{语言}.json` |
| 产品 / 分类数据 | `data/` 下对应文件 |
| 信任条四项指标 | `components/TrustBar.tsx`（硬编码，注意不在 json） |

## 8. 部署

本地验证通过后：`npm run build`，再按 `wrangler.toml` 部署到 Cloudflare Pages（或在 Cloudflare Dashboard 连 Git 仓库自动构建）。

---

交接问题直接联系站点所有者。
