export default async function handler(request, response) {
  const url = request.query.url;
  if (!url || typeof url !== 'string') {
    return response.status(400).json({ error: 'url query parameter is required' });
  }

  const INSTAGRAM_URL_PATTERN = /https?:\/\/(?:www\.)?instagram\.com\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i;
  const match = url.match(INSTAGRAM_URL_PATTERN);
  if (!match) {
    return response.status(400).json({ error: '올바른 인스타그램 게시물 링크를 입력하세요.' });
  }

  const pageUrl = `https://www.instagram.com/${match[1].toLowerCase()}/${match[2]}/`;

  try {
    const res = await fetch(pageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!res.ok) {
      return response.status(502).json({ error: 'Instagram 요청에 실패했습니다.' });
    }

    const html = await res.text();
    const extractMeta = (property) => {
      const regex = new RegExp(`<meta property=["']${property}["'] content=["']([^"']+)["']`, 'i');
      const found = html.match(regex);
      return found?.[1] ?? null;
    };

    const image = extractMeta('og:image');
    const video = extractMeta('og:video:url') || extractMeta('og:video');
    const title = extractMeta('og:title');

    return response.status(200).json({
      shortcode: match[2],
      type: match[1].toLowerCase(),
      title: title ?? '',
      image,
      video,
      url: pageUrl,
    });
  } catch (error) {
    return response.status(500).json({ error: `서버 오류: ${error instanceof Error ? error.message : String(error)}` });
  }
}
