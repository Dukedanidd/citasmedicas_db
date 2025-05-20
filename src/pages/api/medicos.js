import { query } from "@/lib/db";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const medicos = await query({
            query: "SELECT * FROM medicos",
            values: [],
        });

        res.status(200).json({medicos: medicos});
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}