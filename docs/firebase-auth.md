# Firebase Auth setup (client login)

파도파도는 **GitHub Pages(정적)** 에서도 Firebase 클라이언트 로그인을 쓸 수 있게 연결해 두었습니다.
서버 Auth.js(Prisma)는 로컬/백엔드 배포용으로 그대로 유지됩니다.

## 1. Firebase 콘솔

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성(또는 선택)
2. **Authentication → Sign-in method**
   - Google 사용 설정
   - Email/Password 사용 설정
3. **Authentication → Settings → Authorized domains**
   - `localhost`
   - `j2mee-aestes.github.io`
4. **Project settings → Your apps → Web app** 추가 후 config 값 복사

## 2. 환경 변수

`.env.local` (또는 GitHub Actions secrets):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com   # optional
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...                  # optional
```

키가 모두 있으면 `/login`에 **Google / 이메일·회원가입** UI가 나타납니다.
없으면 기존 Auth.js(로컬) 또는 게스트 안내로 동작합니다.

## 3. 현재 동작 범위

| 환경 | 로그인 | 세션 표시 | 서버 API 동기화 |
|------|--------|-----------|-----------------|
| GitHub Pages | Firebase 클라이언트 | 헤더·마이페이지 | 없음 (로컬 즐겨찾기·알림) |
| `npm run dev` + Firebase 키 | Firebase 우선 | 동일 | Auth.js API는 별도 로그인 필요 |
| `npm run dev` + Auth.js만 | 이메일(credentials) | Auth.js 세션 | favorites/schedules/activities |

다음 단계(선택): Firebase ID 토큰을 Auth.js/백엔드에 넘겨 Prisma 사용자와 동기화.

## 4. GitHub Pages 배포

`build:gh-pages` / Actions에 위 `NEXT_PUBLIC_FIREBASE_*` 를 넣어야 정적 번들에 포함됩니다.
