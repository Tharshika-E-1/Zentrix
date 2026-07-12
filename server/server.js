import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"
import userRouter from "./routes/userRoutes.js"
import chatRouter from "./routes/chatRoutes.js"
import messageRouter from "./routes/messageRoutes.js"
import creditRouter from "./routes/creditRoutes.js"
import { stripeWebhooks } from "./controllers/webhooks.js"
import websiteRouter from "./routes/websiteRoutes.js";
import shareRouter from "./routes/shareRoute.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import communityRouter from "./routes/communityRoutes.js";
import ragRouter from "./routes/ragRoutes.js";
import visionRouter from "./routes/visionRoutes.js";

const app = express()

await connectDB()
// Stripe Webhooks
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Server is Live!"))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)
app.use("/api/website", websiteRouter);
app.use("/api/share", shareRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/community", communityRouter);
app.use("/api/rag", ragRouter);
app.use("/api/vision", visionRouter);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})