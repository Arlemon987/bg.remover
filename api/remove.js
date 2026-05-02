import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Upload error" });
    }

    const file = files.image_file;

    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
        },
        body: (() => {
          const formData = new FormData();
          formData.append("image_file", fs.createReadStream(file.filepath));
          formData.append("size", "auto");
          return formData;
        })(),
      });

      if (!response.ok) {
        const text = await response.text();
        return res.status(500).send(text);
      }

      const buffer = await response.arrayBuffer();

      res.setHeader("Content-Type", "image/png");
      res.send(Buffer.from(buffer));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
