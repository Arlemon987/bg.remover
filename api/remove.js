export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  try {
    const chunks = [];

    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/octet-stream"
      },
      body: buffer
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(text);
      return res.status(500).send(text);
    }

    const result = await response.arrayBuffer();

    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(result));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
