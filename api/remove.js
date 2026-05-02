export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  try {
    const formData = new FormData();

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    formData.append("image_file", new Blob([buffer]));
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

    const arrayBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
