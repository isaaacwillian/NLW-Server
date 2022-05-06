import express from "express";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const app = express();

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "fe7dfbf416964e",
    pass: "c0a014184a22c9",
  },
});

app.use(express.json());
app.post("/feedbacks", async (req, res) => {
  const { type, comment, screenshot } = req.body;

  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot,
    },
  });

  await transport.sendMail({
    from: "Equipe Feedget <oi@feedget.com>",
    to: "Isaac Willian <isaaacwillian@gmail.com>",
    subject: "Novo feedback",
    html: [
      `<div style="font-family: sans-serif; font-size: 16; color: #111;"/>`,
      `<p>Tipo do feedback: ${type}</p>`,
      `<p>Comentário: ${comment}</p>`,
      `</div>`,
    ].join(""),
  });

  return res.status(201).json({ data: feedback });
});

app.listen(3333, () => {
  console.log("Server is running");
});
