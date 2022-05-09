import express from "express";
import { NodemailerMailAdapter } from "./repositories/adapters/nodemailer/nodemailer-mail-adapter";
import { PrismaFeedbacksRepository } from "./repositories/prisma/primas-feedbacks-repository";
import { SubmitFeedbackUseCase } from "./use-cases/submit-feedback-use-cases";

export const routes = express.Router();

routes.post("/feedbacks", async (req, res) => {
  const { type, comment, screenshot } = req.body;

  const prismaFeedbacksRepository = new PrismaFeedbacksRepository();

  const nodemailerMailAdapter = new NodemailerMailAdapter();

  const submitFeedbackUseCase = new SubmitFeedbackUseCase(
    prismaFeedbacksRepository,
    nodemailerMailAdapter
  );

  try {
    await submitFeedbackUseCase.execute({
      type,
      comment,
      screenshot,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ Error: error.message });
    }
  }

  return res.status(201).json({ ok: "ok" });
});
