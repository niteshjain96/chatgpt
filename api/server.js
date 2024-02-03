import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'This is ChatGPT AI App',
  });
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: req.body.input },
      ],
      temperature: 0.5,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    // console.log('Passed:', req.body.input);

    // Check if response.data exists and has choices property
    const botResponse = response.choices[0] && response.choices[0].message ? response.choices[0].message.content : 'No response available';
    // console.log(response.choices[0].message.content);
    res.status(200).send({
      bot: botResponse,
    });
  } catch (err) {
    console.log('Failed:', req.body.input);
    console.error(err);
    res.status(500).send(err);
  }
});

app.listen(4000, () => console.log('Server is running on Port 4000'));
