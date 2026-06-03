import { useMemo, useState } from 'react';

type InstagramPostInfo = {
  type: 'p' | 'reel' | 'reels' | 'tv';
  shortcode: string;
};

type InstagramMediaResult = {
  shortcode: string;
  type: string;
  title?: string;
  image?: string;
  video?: string;
  url: string;
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
  const [media, setMedia] = useState<InstagramMediaResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const embedUrl = useMemo(() => {
    return postInfo ? `https://www.instagram.com/${postInfo.type}/${postInfo.shortcode}/embed` : null;
  }, [postInfo]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMedia(null);
    setPostInfo(null);
    setIsLoading(true);

    const parsed = parseInstagramShortcode(postUrl.trim());
    if (!parsed) {
      setError('올바른 인스타그램 게시물 링크를 입력해주세요. 예: https://www.instagram.com/p/SHORTCODE 또는 https://www.instagram.com/reels/SHORTCODE');
      setIsLoading(false);
      return;
    }

    setPostInfo(parsed);

    try {
      const response = await fetch(`http://localhost:4174/api/instagram?url=${encodeURIComponent(postUrl.trim())}`);
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: '서버 응답 오류' }));
        throw new Error(body.error || '서버에서 데이터를 가져오지 못했습니다.');
      }
      const data = await response.json();
      setMedia(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
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
            {media && (
              <div className="preview-footer">
                <p className="font-semibold">다운로드 가능한 미디어</p>
                <div className="mt-4 space-y-3">
                  {media.video && (
                    <a
                      href={media.video}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-2xl bg-brand-point px-5 py-3 text-white"
                    >
                      동영상 열기 / 저장
                    </a>
                  )}
                  {media.image && (
                    <a
                      href={media.image}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-2xl bg-white border border-gray-200 px-5 py-3 text-brand-point"
                    >
                      이미지 열기 / 저장
                    </a>
                  )}
                  {!media.video && !media.image && (
                    <p>미디어를 찾을 수 없거나 Instagram에서 접근이 제한된 게시물입니다.</p>
                  )}
                </div>
              </div>
            )}
            {!media && (
              <div className="preview-footer">
                <p>
                  실제 다운로드 기능은 백엔드 연동이 필요합니다. 이 프로젝트에 서버를 추가하면
                  사진이나 영상을 직접 다운로드하도록 확장할 수 있습니다.
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
