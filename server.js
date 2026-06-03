import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: true }));

const INSTAGRAM_URL_PATTERN = /https?:\/\/(?:www\.)?instagram\.com\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i;

const parseInstagramUrl = (url) => {
  const match = url.match(INSTAGRAM_URL_PATTERN);
  if (!match) return null;

  return {
    type: match[1].toLowerCase(),
    shortcode: match[2],
  };
};

const extractMeta = (html, property) => {
  const regex = new RegExp(`<meta property=["']${property}["'] content=["']([^"']+)["']`, 'i');
  const match = html.match(regex);
  return match?.[1] ?? null;
};

app.get('/api/instagram', async (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'url query parameter is required' });
  }

  const parsed = parseInstagramUrl(url);
  if (!parsed) {
    return res.status(400).json({ error: '올바른 인스타그램 게시물 링크를 입력하세요.' });
  }

  const pageUrl = `https://www.instagram.com/${parsed.type}/${parsed.shortcode}/`;

  try {
    const response = await fetch(pageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Instagram 요청에 실패했습니다.' });
    }

    const html = await response.text();
    const image = extractMeta(html, 'og:image');
    const video = extractMeta(html, 'og:video:url') || extractMeta(html, 'og:video');
    const title = extractMeta(html, 'og:title');

    return res.json({
      shortcode: parsed.shortcode,
      type: parsed.type,
      title: title ?? '',
      image,
      video,
      url: pageUrl,
    });
  } catch (error) {
    return res.status(500).json({ error: `서버 오류: ${error instanceof Error ? error.message : String(error)}` });
  }
});

const PORT = 4174;
app.listen(PORT, () => {
  console.log(`Instagram downloader API 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
