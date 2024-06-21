const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const POSTS_DIR = path.join(__dirname, 'posts');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create a new blog post
app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  const id = Date.now().toString();
  const timestamp = new Date();
  const post = { id, title, content, timestamp };
  const filePath = path.join(POSTS_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
  res.status(201).json(post);
});

// Get all blog posts
app.get('/api/posts', (req, res) => {
  const files = fs.readdirSync(POSTS_DIR);
  const posts = files.map(file => {
    const content = fs.readFileSync(path.join(POSTS_DIR, file));
    return JSON.parse(content);
  });
  res.json(posts);
});

// Get a single blog post
app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const filePath = path.join(POSTS_DIR, `${id}.json`);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath);
    const post = JSON.parse(content);
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Update a blog post
app.put('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const timestamp = new Date();
  const post = { id, title, content, timestamp };
  const filePath = path.join(POSTS_DIR, `${id}.json`);
  if (fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Delete a blog post
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const filePath = path.join(POSTS_DIR, `${id}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
