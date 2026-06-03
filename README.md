# Instagram Downloader

간단한 인스타그램 게시물 입력 UI를 가진 React/Vite 앱입니다.

## 실행 방법

1. `cd /Users/owal/Desktop/insta`
2. `npm install`
3. `npm run dev`
4. 로컬에서는 별도 백엔드가 필요하면 `npm run server`를 실행하거나, Vercel에 배포하면 `/api/instagram` 함수가 자동으로 사용됩니다.

## 기능

- 인스타그램 게시물 URL을 입력하면 링크를 검증합니다.
- 유효한 링크가 입력되면 게시물 임베드를 보여줍니다.
- 백엔드 API를 통해 Instagram 미디어 URL을 가져옵니다.

## 배포 방법

- 로컬 개발: `npm run dev` + `npm run server`
- Vercel 배포: `api/instagram.js`가 서버리스 함수로 동작하므로 별도 서버 없이도 `/api/instagram` 경로를 사용할 수 있습니다.

## 주의

- 지금까지의 코드는 `localhost:4174`로만 동작하는 기존 서버 대신, Vercel 배포 시 `api/instagram.js`를 통해 직접 데이터를 가져오도록 개선되었습니다.

