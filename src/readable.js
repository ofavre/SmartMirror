import config from '@/config';

export default function (url) {
  const mercuryUrl = new URL('http://127.0.0.1:9090/https://mercury.postlight.com/parser');
  mercuryUrl.searchParams.set('url', url);
  return fetch(mercuryUrl.href, {
    headers: new Headers({
      'X-Api-Key': config.MercuryApiKey,
    }),
    credentials: 'omit',
  }).then((response) => {
    if (!response.ok) throw response;
    return response.json();
  });
}
