const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());       
app.use(express.urlencoded({extended: true})); 
const escapeHtml = require('escape-html');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Nombre d'itérations pour le sel
const PORT = 80;


app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use(cookieParser());
const activeSessions = {};

const db = require('./database');

function is_logged_in(req) {
  const sessionId = req.cookies.sessionId;
  const session = activeSessions[sessionId];
  return session;
}

// ------------- SERVER
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.post('/register', async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing username or email or password' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    db.execute_with_params('INSERT INTO user (pseudo, email, password, admin) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, 0]);
    res.redirect('/');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});


// ------------- API
app.post("/api/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }
  try {
    const results = await db.execute_with_params('SELECT id, admin, password FROM user WHERE pseudo = ?', [username]);
    if (results.length === 1) {
      const hashedPassword = results[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
      if (passwordMatch) {
        const sessionId = Math.random().toString(36).substring(2);
        activeSessions[sessionId] = { username: username, id_user: results[0].id, admin: results[0].admin };
        res.cookie('sessionId', sessionId);
        return res.status(200).json({ message: 'Login successful' });
      }
    }
  } catch (error) {
    console.log(error);
  }
  return res.status(401).json({ message: 'Login failed' });
});


app.get('/api/logout', (req, res) => {
  if (is_logged_in(req)) {
    const sessionId = req.cookies.sessionId;
    delete activeSessions[sessionId];
    res.clearCookie('sessionId');
  }
  res.status(200).json({ message: 'Logout done' });
});

app.get('/api/is_logged_in', (req, res) => {
  if (is_logged_in(req)) {
    res.status(200).json({ message: 'User is logged in' , id_user: activeSessions[req.cookies.sessionId].id_user, admin: activeSessions[req.cookies.sessionId].admin});
  } else {
    res.status(200).json({ message: 'User is not logged in' });
  }
});

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/style.css');
});

app.get('/api/my_messages', async (req, res) => {
  if (!is_logged_in(req)) {
    return res.status(401).json({ message: 'User is not logged in' });
  }
  const sessionId = req.cookies.sessionId;
  const id_user = activeSessions[sessionId].id_user;
  console.log('id_user: ' + id_user);
  const q = await db.execute_with_params('SELECT id FROM message WHERE id_user = ?', [id_user]);
    console.log('Query: ' + q + ' Params: ' + [id_user]);
    if (q) {
      res.json({ m: 'My messages', data: q });
    }else {
      res.status(500).json({ m: 'Internal server error' });
    }
});

app.get('/api/my_threads', async (req, res) => {
  if (!is_logged_in(req)) {
    return res.status(401).json({ message: 'User is not logged in' });
  }
  const sessionId = req.cookies.sessionId;
  const id_user = activeSessions[sessionId].id_user;
  console.log('id_user: ' + id_user);
  const q = await db.execute_with_params('SELECT id FROM thread WHERE id_user = ?', [id_user]);
  console.log('Query: ' + q + ' Params: ' + [id_user]);
  if (q) {
    res.json({ m: 'My threads', data: q });
  }else {
    res.status(500).json({ m: 'Internal server error' });
  }
});


// --------------- READING ALL DATA
app.get('/api/all_messages', async (req, res) => {
  try {
      const results = await db.execute_on_db('SELECT id, content, date, id_user, (SELECT pseudo from user WHERE id = id_user) as pseudo_user, id_thread FROM message');
      res.status(200).json({ m: 'All messages', data: results });
  } catch (error) {
      res.status(500).json({ m: 'Error fetching messages', error: error.message });
  }
});

app.get('/api/all_threads', async (req, res) => {
  try {
      const results = await db.execute_on_db('SELECT id, name, date, id_user, (SELECT pseudo from user WHERE id = id_user) as pseudo_user, id_topic FROM thread');
      res.status(200).json({ m: 'All threads', data: results });
  } catch (error) {
      res.status(500).json({ m: 'Error fetching threads', error: error.message });
  }
});

app.get('/api/all_topics', async (req, res) => {
  try {
      const results = await db.execute_on_db('SELECT * FROM topic');
      res.status(200).json({ m: 'All topics', data: results });
  } catch (error) {
      res.status(500).json({ m: 'Error fetching topics', error: error.message });
  }
});

app.get('/api/my_info', async (req, res) => {
  if (!is_logged_in(req)) {
    return res.status(401).json({ message: 'User is not logged in' });
  }
  const sessionId = req.cookies.sessionId;
  const id_user = activeSessions[sessionId].id_user;
  try {
      const results = await db.execute_with_params('SELECT * FROM user WHERE id = ?', [id_user]);
      res.status(200).json({ m: 'User info', data: results });
  } catch (error) {
      res.status(500).json({ m: 'Error fetching user info', error: error.message });
  }
});

// ----------------- CREATE DATA
app.post('/api/create/topic', async (req, res) => {
  if (!is_logged_in(req)) {
    return res.status(401).json({ message: 'User is not logged in' });
  }
  const name = escapeHtml(req.body.name);
  const sessionId = req.cookies.sessionId;
  if (!name) {
    return res.status(400).json({ message: 'Missing name' });
  }
  try {
      const ins = await db.execute_with_params('INSERT INTO topic (name, id_user) VALUES (?, ?)', [name, activeSessions[sessionId].id_user]);
      const results = await db.execute_on_db('SELECT * FROM topic');
      res.status(200).json({ m: 'Topic created', data: results });
  } catch (error) {
      res.status(500).json({ m: 'Error creating topic', error: error.message });
  }
});

app.post('/api/create/thread', async (req, res) => {
  if (!is_logged_in(req)) {
    return res.status(401).json({ message: 'User is not logged in' });
  }
  const name = escapeHtml(req.body.name);
  const id_topic = req.body.id_topic;
  const sessionId = req.cookies.sessionId;
  console.log('thread id_topic: ' + id_topic);
  console.log('thread name: ' + name);
  if (!name || !id_topic) {
    return res.status(400).json({ message: 'Missing name or id_topic' });
  }
  try {
      const ins = await db.execute_with_params('INSERT INTO thread (name, id_topic, id_user, date) VALUES (?, ?, ?, ?)', [name, id_topic, activeSessions[sessionId].id_user, new Date()]);
      const results = await db.execute_on_db('SELECT * FROM thread');
      res.status(200).json({ m: 'Thread created', data: results });
  } catch (error) {
      console.log(error);
      res.status(500).json({ m: 'Error creating thread', error: error.message });
  }
});

app.post('/api/create/message', async (req, res) => {
  if (!is_logged_in(req)) {
    return res.status(401).json({ message: 'User is not logged in' });
  }
  const content = escapeHtml(req.body.content);
  const id_thread = req.body.id_thread;
  const sessionId = req.cookies.sessionId;
  if (!content || !id_thread) {
    return res.status(400).json({ message: 'Missing content or id_thread' });
  }
  try {
      const ins = await db.execute_with_params('INSERT INTO message (content, id_thread, id_user, date) VALUES (?, ?, ?, ?)', [content, id_thread, activeSessions[sessionId].id_user, new Date()]);
      const results = await db.execute_on_db('SELECT * FROM message');
      res.status(200).json({ m: 'Message created', data: results });
  } catch (error) {
      res.status(500).json({ m: 'Error creating message', error: error.message });
  }
});

// ----------------- DELETE DATA
app.delete('/api/delete/topic/:id', async (req, res) => {
  if (!is_logged_in(req)) {
    return res.status(401).json({ message: 'User is not logged in' });
  }
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: 'Missing id' });
  }
  // check if user is the owner of the topic
  const sessionId = req.cookies.sessionId;
  const id_user = activeSessions[sessionId].id_user;
  const q = await db.execute_with_params('SELECT id_user FROM topic WHERE id = ?', [id]);
  if (q) {
    if (q[0].id_user != id_user) {
      return res.status(401).json({ message: 'User is not the owner of the topic' });
    }else{
      try {
        const results = await db.execute_with_params('DELETE FROM topic WHERE id = ?', [id]);
        res.status(200).json({ m: 'Topic deleted', data: results });
      } catch (error) {
          res.status(500).json({ m: 'Error deleting topic', error: error.message });
      }
    }
  }else {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/delete/thread/:id', async (req, res) => {
  if (!is_logged_in(req)) {
    return res.status(401).json({ message: 'User is not logged in' });
  }
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: 'Missing id' });
  }
  // check if user is the owner of the thread
  const sessionId = req.cookies.sessionId;
  const id_user = activeSessions[sessionId].id_user;
  const q = await db.execute_with_params('SELECT id_user FROM thread WHERE id = ?', [id]);
  console.log('Query: ' + q + ' Params: ' + [id]);
  if (q) {
    if (q[0].id_user != id_user) {
      return res.status(401).json({ message: 'User is not the owner of the thread' });
    }else{
      try {
        const results = await db.execute_with_params('DELETE FROM thread WHERE id = ?', [id]);
        res.status(200).json({ m: 'Thread deleted', data: results });
      } catch (error) {
          res.status(500).json({ m: 'Error deleting thread', error: error.message });
      }
    }
  }else {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/delete/message/:id', async (req, res) => {
  if (!is_logged_in(req)) {
    return res.status(401).json({ message: 'User is not logged in' });
  }
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: 'Missing id' });
  }
  const sessionId = req.cookies.sessionId;
  const id_user = activeSessions[sessionId].id_user;
  const q = await db.execute_with_params('SELECT id_user FROM message WHERE id = ?', [id]);
  if (q) {
    if (q[0].id_user != id_user) {
      return res.status(401).json({ message: 'User is not the owner of the message' });
    }else{
      try {
        const results = await db.execute_with_params('DELETE FROM message WHERE id = ?', [id]);
        res.status(200).json({ m: 'Message deleted', data: results });
      } catch (error) {
          res.status(500).json({ m: 'Error deleting message', error: error.message });
      }
    }
  }else {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// ----------------- UPDATE DATA
app.post('/api/update_my_profile', async (req, res) => {
  if (!is_logged_in(req)) {
    return res.status(401).json({ message: 'User is not logged in' });
  }
  const pseudo = escapeHtml(req.body.pseudo);
  const email = escapeHtml(req.body.email);
  const password = escapeHtml(req.body.password);
  const sessionId = req.cookies.sessionId;
  if (!pseudo || !email || !password) {
    return res.status(400).json({ message: 'Missing pseudo or email or password' });
  }
  try {
      const upd = await db.execute_with_params('UPDATE user SET pseudo = ?, email = ?, password = ? WHERE id = ?', [pseudo, email, password, activeSessions[sessionId].id_user]);
      const results = await db.execute_on_db('SELECT * FROM user');
      res.status(200).json({ m: 'User updated', data: results });
  } catch (error) {
      res.status(500).json({ m: 'Error updating user', error: error.message });
  }
});

