const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://internship-assignment-2.vercel.app/",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});
const port = 4000;

const users = []; // In-memory storage
const posts = [
  {
    id: 4500,
    photoUrl:
      "https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Bubbles Post ",
    likes: 89,
    comments: [],
  },
  {
    id: 4000,
    photoUrl:
      "https://images.unsplash.com/photo-1488509082528-cefbba5ad692?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Chatting girl",
    likes: 53,
    comments: [],
  },
  {
    id: 5000,
    photoUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Mountains",
    likes: 75,
    comments: [],
  },
];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ username, password: hashedPassword });
  res.status(200).send({ message: "User registered successfully" });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ username }, "secretkey", { expiresIn: "1h" });
    res.status(200).send({ username, token });
  } else {
    res.status(401).send({ message: "Invalid credentials" });
  }
});

app.get("/api/posts", (req, res) => {
  res.status(200).send(posts);
});

app.post("/api/upload", upload.single("photo"), (req, res) => {
  const { description } = req.body;
  const photoUrl = `https://internship-assignment-2-qpt2.onrender.com/uploads/${req.file.filename}`;
  const post = {
    id: posts.length + 1,
    photoUrl,
    description,
    likes: 0,
    comments: [],
  };
  posts.push(post);
  io.emit("newPost", post); // Emit new post event
  res.status(200).send(post);
});

app.post("/api/posts/:id/like", (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = posts.find((p) => p.id == id);
  if (post) {
    if (!post.likedBy) {
      post.likedBy = [];
    }
    if (post.likedBy.includes(userId)) {
      return res.status(400).send({ message: "User already liked this post" });
    }
    post.likes += 1;
    post.likedBy.push(userId);
    io.emit("updateLikes", { id: post.id, likes: post.likes }); // Emit likes update event
    res.status(200).send({ id: post.id, likes: post.likes });
  } else {
    res.status(404).send({ message: "Post not found" });
  }
});

app.post("/api/posts/:id/comment", (req, res) => {
  const { id } = req.params;
  const { userId, comment } = req.body;
  const post = posts.find((p) => p.id == id);
  if (post) {
    post.comments.push(comment);
    io.emit("newComment", { id: post.id, comments: post.comments }); // Emit new comment event
    res.status(200).send({ id: post.id, comments: post.comments });
  } else {
    res.status(404).send({ message: "Post not found" });
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
