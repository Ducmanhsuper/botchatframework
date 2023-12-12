import express from "express";
import ConfigBodyParser from "./Setting/configBodyParser";
import ListenApp from "./Setting/ListenApp";
import webRoutes from "./routes/Web";
import configViewEngine from "./config/viewEngine";
// config server;
const app = express();
// BaBel labrary
ConfigBodyParser(app);
// Routing
webRoutes(app);
// comfigViewEngine 
configViewEngine(app);
// app listen
ListenApp(app);    