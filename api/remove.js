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

    // ✅ correct form-data (Node version)
    const formData = new FormData();
    formData.append("image_file", buffer, {
      filename: "image.png",
      contentType: "image/png",
    });
    formData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        ...formData.getHeaders(), // 🔥 important
      },
      body: formData,
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
