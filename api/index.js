const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;

export default async function handler(req, res) {
  const credentials = await fetch(
    "https://open.tiktokapis.com/v2/oauth/token/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    }
  ).then((response) => response.json());

  if (credentials?.access_token) {
    const posts = await fetch(
      "https://open.tiktokapis.com/v2/research/video/query/?fields=id,embed_link,view_count",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${credentials.access_token}`,
        },
        body: JSON.stringify({
          query: { username: { eq: "vocesqueabrazan" } },
          order: { view_count: "DESC" },
          max_count: 3,
        }),
      }
    ).then((response) => response.json());

    return res.status(200).json(posts);
  }

  return res.status(200).json({
    error: {
      message: "Failed to fetch TikTok posts",
      code: "FETCH_ERROR",
    },
  });
}
