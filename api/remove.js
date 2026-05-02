import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  try {
    // read incoming file
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // build proper form-data
    const formData = new FormData();
    formData.append("image_file", buffer, {
      filename: "image.png",
      contentType: "image/png",
    });

    // 🔥 QUALITY SETTINGS
    formData.append("size", "full");   // full resolution
    formData.append("format", "png");  // best quality

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        ...formData.getHeaders(),
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
