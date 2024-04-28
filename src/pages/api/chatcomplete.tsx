import OpenAI from "openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { copyFileSync } from "fs";

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

        const conversationContext = userMessage.length > 5 ? userMessage.slice(-5) : userMessage;

        const messageWithInstructions = [
            { role: "system", content: "You are an insulting chatbot in the style of Gordon Ramsay."},
            ...conversationContext
        ];

        console.log(messageWithInstructions);

        const completion = await openAI.chat.completions.create({
            messages: messageWithInstructions,
            model: "ft:gpt-3.5-turbo-0125:personal:ramsay2:9IRgRiUh",
            temperature: 0.8,
            max_tokens: 75,
            top_p: 0.8,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const botReply = completion.choices[0].message.content; 
        res.status(200).json({ botReply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error"});
    }
}