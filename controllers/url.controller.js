import { nanoid } from "nanoid";
import { URL } from "../models/url.model.js";
import { sendMilestoneNotification } from "../services/notification.service.js";

async function hanldeGenerateNewShortURL(req, res) {
  const body = req.body ?? {};
  if (!body.url || !/^https?:\/\//i.test(body.url))
    return res.status(400).json({ error: "valid http(s) url is required" });
  if (!body.ownerEmail)
    return res.status(400).json({ error: "ownerEmail is required" });
  const milestone = Number(body.milestone ?? 10);
  if (!Number.isInteger(milestone) || milestone < 1)
    return res
      .status(400)
      .json({ error: "milestone must be a positive integer" });
  const shortID = nanoid(8);
  console.log(shortID);

  await URL.create({
    shortID: shortID,
    redirectURL: body.url,
    visitHistory: [],
    ownerEmail: body.ownerEmail.toLowerCase().trim(),
    milestone: milestone,
  });

  return res
    .status(201)
    .json({
      shortID: shortID,
      shortURL:
        (process.env.BASE_URL ||
          "http://localhost:" + (process.env.PORT || 4000)) +
        "/url/" +
        shortID,
      milestone: milestone,
    });
}

const handleRedirectedURL = async (req, res) => {
  try {
    const { shortID } = req.params;

    const entry = await URL.findOneAndUpdate(
      { shortID: shortID },
      {
        $push: { visitHistory: { timestamp: new Date() } },
        $inc: { clickCount: 1 },
      },
      { new: true },
    );

    if (!entry) {
      return res.status(404).send("Short URL not found");
    }
    if (entry.clickCount >= entry.milestone && !entry.milestoneNotified) {
      const claimed = await URL.findOneAndUpdate(
        { _id: entry._id, milestoneNotified: false },
        { $set: { milestoneNotified: true } },
        { new: true },
      );
      if (claimed)
        sendMilestoneNotification(claimed).catch((error) =>
          console.error("Notification failed:", error),
        );
    }

    return res.redirect(entry.redirectURL);
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const handleGetAnalytics = async (req, res) => {
  const { shortID } = req.params;
  const result = await URL.findOne({ shortID });
  if (!result) return res.status(404).json({ error: "Short URL not found" });
  return res.status(200).json({
    totalclicks: result.clickCount,
    milestone: result.milestone,
    milestoneNotified: result.milestoneNotified,
    analytics: result.visitHistory,
  });
};

export { hanldeGenerateNewShortURL, handleRedirectedURL, handleGetAnalytics };
