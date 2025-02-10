import express from 'express';
import session from 'express-session';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

import { Request, Response, NextFunction } from 'express';
declare module 'express-session' {
  interface SessionData {
    authenticated?: boolean;
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.authenticated) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

app.get('/', authenticate, (req: Request, res: Response) => {
  res.send('Welcome to the shapes-clone admin interface!');
});

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    req.session.authenticated = true;
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send('Could not log out');
    } else {
      res.send('Logout successful');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Web admin interface running on http://localhost:${PORT}`);
});
