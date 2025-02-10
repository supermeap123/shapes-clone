import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/settings', (req, res) => {
  const { setting, value } = req.body;
  // Update bot settings based on the request
  res.send({ success: true, message: `${setting} updated to ${value}` });
});

app.post('/commands/:command', (req, res) => {
  const { command } = req.params;
  const { enabled } = req.body;
  // Enable or disable the specified command
  res.send({ success: true, message: `${command} ${enabled ? 'enabled' : 'disabled'}` });
});

app.post('/messages', (req, res) => {
  const { message } = req.body;
  // Customize bot messages based on the request
  res.send({ success: true, message: `Custom message set to ${message}` });
});

app.listen(PORT, () => {
  console.log(`Web admin interface running on port ${PORT}`);
});
