import express from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import { exec } from 'child_process';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/config', (req, res) => {
  const { discordToken, openrouterApiKey, guildId } = req.body;

  // Update .env file
  const envContent = `DISCORD_TOKEN=${discordToken}\nOPENROUTER_API_KEY=${openrouterApiKey}\nGUILD_ID=${guildId}\nPORT=${port}`;
  require('fs').writeFileSync('.env', envContent);
  dotenv.config();

  // Restart the bot
  exec('npm run start', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error restarting bot: ${error}`);
      return res.send('Error restarting bot.');
    }
    console.log(`Bot restart output: ${stdout}`);
    res.send('Configuration updated and bot restarted!');
  });
});

app.listen(port, () => {
  console.log(`Web administration panel listening on port ${port}`);
});
