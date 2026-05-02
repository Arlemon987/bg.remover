export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  try {
    const formData = new FormData();

    // read file from incoming request
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    // 🔥 CRITICAL FIX: send as image_file
    formData.append("image_file", new Blob([buffer]), "image.png");
    formData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).send(text);
    }

    const result = await response.arrayBuffer();

    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(result));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
