const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 12;

const json = (res, status, payload, cache = false) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Access-Control-Allow-Origin", "https://mundobiohack.com");
  if (cache) {
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=1800");
  } else {
    res.setHeader("Cache-Control", "no-store");
  }
  res.end(JSON.stringify(payload));
};

const cleanCaption = (caption = "") => String(caption).replace(/\s+/g, " ").trim();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || "";
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID || "";
  const apiVersion = process.env.INSTAGRAM_API_VERSION || "v25.0";
  const graphBaseUrl = (process.env.INSTAGRAM_GRAPH_BASE_URL || "https://graph.instagram.com").replace(/\/$/, "");

  if (!accessToken || !accountId) {
    return json(res, 503, {
      ok: false,
      configured: false,
      error: "instagram_not_configured"
    });
  }

  const requestedLimit = Number.parseInt(req.query?.limit || DEFAULT_LIMIT, 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), MAX_LIMIT)
    : DEFAULT_LIMIT;

  const fields = [
    "id",
    "caption",
    "media_type",
    "media_product_type",
    "media_url",
    "thumbnail_url",
    "permalink",
    "timestamp"
  ].join(",");

  const endpoint = new URL(`${graphBaseUrl}/${apiVersion}/${accountId}/media`);
  endpoint.searchParams.set("fields", fields);
  endpoint.searchParams.set("limit", String(limit));
  endpoint.searchParams.set("access_token", accessToken);

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" }
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Instagram API error", response.status, body?.error?.type || body?.error?.code || "unknown");
      return json(res, 502, {
        ok: false,
        configured: true,
        error: "instagram_upstream_error"
      });
    }

    const items = Array.isArray(body.data)
      ? body.data
          .map((item) => {
            const mediaType = String(item.media_type || "").toUpperCase();
            const productType = String(item.media_product_type || "").toUpperCase();
            const isReel = productType === "REELS" || mediaType === "VIDEO";
            const imageUrl = item.thumbnail_url || (mediaType === "IMAGE" || mediaType === "CAROUSEL_ALBUM" ? item.media_url : "");
            const caption = cleanCaption(item.caption);

            if (!item.id || !item.permalink || !imageUrl) return null;

            return {
              id: item.id,
              type: isReel ? "Reel" : mediaType === "CAROUSEL_ALBUM" ? "Carrusel" : "Publicación",
              caption,
              thumbnail: imageUrl,
              url: item.permalink,
              timestamp: item.timestamp || ""
            };
          })
          .filter(Boolean)
      : [];

    return json(res, 200, {
      ok: true,
      configured: true,
      source: "instagram_api",
      items
    }, true);
  } catch (error) {
    console.error("Instagram feed fetch failed", error?.message || error);
    return json(res, 502, {
      ok: false,
      configured: true,
      error: "instagram_fetch_failed"
    });
  }
}
