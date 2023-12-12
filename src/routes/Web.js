// Defined Routes
import express from "express";
import bodyParser from "body-parser";
import controllers from "../controllers/controllers";
import services from "../services/BotServices";
const router = express.Router();
const webRoutes = (app) => {
    router.get("/webhook", controllers.getWebhook);
    router.post("/webhook",bodyParser.json(), controllers.postWebhook);
    router.post("/persistent", controllers.persistent);
    router.post("/profile", services.SetupProfile);
    router.get("/", (req,res)=> {
        res.render("Api.ejs")
    })
    return app.use("/", router)
 }
 module.exports = webRoutes;