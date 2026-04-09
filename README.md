# 독초 — Venom Flower Studio
## 셋업 가이드

---

## 📁 파일 구조

```
dokcho/
├── index.html        ← 메인 사이트 (홈화면)
├── manifest.json     ← PWA 설정
├── sw.js             ← 서비스워커 (오프라인 지원)
├── icons/            ← 앱 아이콘 (192x192, 512x512 PNG 넣기)
└── audio/
    └── away.mp3      ← Away 음원 파일 여기에 넣기
```

---

## 🔥 Firebase 연동 방법 (5분)

### 1. Firebase 프로젝트 만들기
1. https://console.firebase.google.com 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `dokcho-studio` (아무거나)
4. Google Analytics: 원하면 켜기 (무료)

### 2. Firestore 데이터베이스 활성화
1. 왼쪽 메뉴 → "Firestore Database"
2. "데이터베이스 만들기" 클릭
3. **테스트 모드**로 시작 (나중에 보안 규칙 설정)
4. 위치: `asia-northeast3 (Seoul)` 선택

### 3. 웹 앱 등록 & Config 복사
1. 프로젝트 설정 (톱니바퀴 아이콘)
2. "앱 추가" → 웹 (`</>`) 선택
3. 앱 닉네임: `dokcho-web`
4. 생성된 `firebaseConfig` 객체 복사

### 4. index.html에 Config 붙여넣기
```js
const firebaseConfig = {
  apiKey: "AIza...",           ← 복사한 값으로 교체
  authDomain: "dokcho-...",
  projectId: "dokcho-...",
  storageBucket: "dokcho-...",
  messagingSenderId: "...",
  appId: "1:..."
};
```

---

## 🎵 음원 파일 넣는 방법
1. `audio/` 폴더 만들기
2. Away 편집영상 음원을 `away.mp3` 로 저장
3. `audio/away.mp3` 경로에 파일 배치
4. index.html의 `<audio>` 태그 주석 해제:
```html
<source src="audio/away.mp3" type="audio/mpeg">
```

**음원 없이 테스트:** index.html에서 `devMode = true` 로 변경하면
30초 시뮬레이션으로 바로 시작버튼 활성화됨

---

## 🌐 배포 방법 (무료)

### Firebase Hosting (추천)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # public 폴더: . (현재 폴더)
firebase deploy
```
→ `https://dokcho-studio.web.app` 같은 URL 생성

### 또는 Vercel (더 간단)
1. https://vercel.com 가입
2. 폴더 드래그앤드롭으로 배포 완료
→ 어디서든 접속 가능한 URL 생성

---

## 📱 모바일 앱처럼 설치
1. 배포된 URL을 크롬에서 열기
2. 브라우저 메뉴 → "홈 화면에 추가"
3. 독초 아이콘이 앱처럼 생성됨

---

## 🗺️ 다음 단계
- Phase 2: 크로키 타이머 + 갤러리 업로드
- Phase 3: 집중 모드 (Python 차단 스크립트)
- Phase 4: 레퍼런스 관리 + 마인드맵
- Phase 5: 독초 아이덴티티 디자인 완성
