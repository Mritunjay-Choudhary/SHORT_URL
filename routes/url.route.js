import { Router } from "express";
import {
  hanldeGenerateNewShortURL,
  handleRedirectedURL,
  handleGetAnalytics,
} from "../controllers/url.controller.js";

export const router = Router();

router.post("/shorten", hanldeGenerateNewShortURL);
router.get("/analytics/:shortID", handleGetAnalytics);
router.get("/:shortID", handleRedirectedURL);
