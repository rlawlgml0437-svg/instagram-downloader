import { useMemo, useState } from 'react';

type InstagramPostInfo = {
  type: 'p' | 'reel' | 'reels' | 'tv';
  shortcode: string;
};

const INSTAGRAM_URL_PATTERN = /https?:\/\/(?:www\.)?instagram\.com\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i;

const parseInstagramShortcode = (url: string): InstagramPostInfo | null => {
  const match = url.match(INSTAGRAM_URL_PATTERN);
  if (!match) return null;

  return {
    type: match[1].toLowerCase() as InstagramPostInfo['type'],
    shortcode: match[2],
  };
};

const App = () => {
  const [postUrl, setPostUrl] = useState('');
  const [error, setError] = useState('');
  const [postInfo, setPostInfo] = useState<InstagramPostInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const embedUrl = useMemo(() => {
    return postInfo ? `https://www.instagram.com/${postInfo.type}/${postInfo.shortcode}/embed` : null;
  }, [postInfo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const parsed = parseInstagramShortcode(postUrl.trim());
    if (!parsed) {
      setError('올바른 인스타그램 게시물 링크를 입력해주세요. 예: https://www.instagram.com/p/SHORTCODE 또는 https://www.instagram.com/reels/SHORTCODE');
      setPostInfo(null);
      setIsLoading(false);
      return;
    }

    setPostInfo(parsed);
    setIsLoading(false);
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Instagram Downloader</p>
          <h1>인스타그램 게시물 링크로 사진/영상 다운로드</h1>
          <p className="subtitle">
            링크를 입력하면 게시물 미리보기와 다운로드 정보를 준비합니다.
          </p>
        </div>
      </header>

      <main className="content">
        <form className="card card-form" onSubmit={handleSubmit}>
          <label htmlFor="instagram-url">게시물 URL</label>
          <input
            id="instagram-url"
            type="url"
            placeholder="https://www.instagram.com/p/SHORTCODE"
            value={postUrl}
            onChange={(event) => setPostUrl(event.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? '검증 중...' : '미리보기 열기'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>

        {postInfo && (
          <section className="card card-preview">
            <div className="preview-header">
              <h2>게시물 미리보기</h2>
              <p>Instagram 임베드를 통해 게시물을 확인할 수 있습니다.</p>
            </div>
            <div className="preview-frame">
              <iframe
                title="Instagram preview"
                src={embedUrl ?? undefined}
                allow="encrypted-media"
                loading="lazy"
              />
            </div>
            <div className="preview-footer">
              <p>
                실제 다운로드 기능은 백엔드 연동이 필요합니다. 이 프로젝트에 서버를 추가하면
                사진이나 영상을 직접 다운로드하도록 확장할 수 있습니다.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
