export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        ...req.headers, // 🔥 forward original form-data headers
      },
      body: req, // 🔥 forward original body directly
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(text);
      return res.status(500).send(text);
    }

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(buffer));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
