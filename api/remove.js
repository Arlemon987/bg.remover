export default async function handler(req, res) {
    const apiKey = process.env.REMOVE_BG_API_KEY;

    const formData = req.body;

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
            "X-Api-Key": apiKey
        },
        body: formData
    });

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(Buffer.from(buffer));
}
