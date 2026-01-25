import { authenticated } from "../middlewares/auth.js";
import Quote from "../models/quote-model.js";

const quoteApi = (app) => {
  app.post("/quotes", async (req, res) => {
    try {
      const newQuote = await Quote.create({
        text: req.body.quote,
      });
      res.json(newQuote);
    } catch (err) {
      res.status(500).json(err.message);
    }
  });

  app.get("/quotes", async (req, res) => {
    try {
      const quotes = await Quote.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.json(quotes);
    } catch (err) {
      res.status(500).json(err.message);
    }
  });

  app.get("/quotes/:id", async (req, res) => {
    try {
      const quote = await Quote.findByPk(req.params.id);
      res.json(quote);
    } catch (err) {
      res.status(500).json(err.message);
    }
  });

  app.put("/quotes/:id", async (req, res) => {
    try {
      const updateData = {};
      if (req.body.quote) updateData.text = req.body.quote;

      const [updatedQuote] = await Quote.update(updateData, {
        where: { id: req.params.id },
      });
      res.json("Updated");
    } catch (err) {
      res.status(500).json(err.message);
    }
  });

  app.delete("/quotes/:id", authenticated, async (req, res) => {
    try {
      await Quote.destroy({
        where: { id: req.params.id },
      });
      res.json("Deleted");
    } catch (err) {
      res.status(500).json(err.message);
    }
  });
};

export default quoteApi;
