# Instagram Downloader

간단한 인스타그램 게시물 입력 UI를 가진 React/Vite 앱입니다.

## 실행 방법

1. `cd /Users/owal/Desktop/insta`
2. `npm install`
3. `npm run dev`
4. 다른 터미널에서 `npm run server`로 백엔드를 실행합니다.

## 기능

- 인스타그램 게시물 URL을 입력하면 링크를 검증합니다.
- 유효한 링크가 입력되면 게시물 임베드를 보여줍니다.
- 백엔드 API를 통해 Instagram 미디어 URL을 가져옵니다.

## 서버 추가

이 프로젝트는 `server.js`를 통해 Instagram 게시물 페이지에서 `og:image`와 `og:video` 메타 태그를 읽어옵니다. 프론트엔드는 `http://localhost:4174/api/instagram?url=...`로 요청해서 미디어 URL 정보를 가져옵니다.

## 실행 예시

- `npm run dev` → 프론트엔드
- `npm run server` → 백엔드

