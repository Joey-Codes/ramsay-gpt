import OpenAI from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

const openAIOptions = {
    apiKey: process.env.OPENAI_API_KEY,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    try {
        const openAI = new OpenAI(openAIOptions);

        const { userMessage } = req.body;
        const completion = await openAI.chat.completions.create({
            messages: userMessage,
            model: "gpt-3.5-turbo-0125",
            temperature: 0.7,
            max_tokens: 100,
        });

        const botReply = completion.choices[0].message.content; 
        res.status(200).json({ botReply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error"});
    }
}