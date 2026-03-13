const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Helper function to count stock from text files
function getStockCount(filename) {
    try {
        const filePath = path.join(__dirname, 'stock', filename);
        if (!fs.existsSync(filePath)) return 0;
        const data = fs.readFileSync(filePath, 'utf-8');
        return data.split('\n').filter(line => line.trim() !== '').length;
    } catch (err) {
        return 0;
    }
}

// API to get stock data
app.get('/api/stock', (req, res) => {
    const stock = [
        { service: 'Crunchyroll', count: getStockCount('crunchyroll.txt'), tier: 'FREE', color: '#FF8C00' },
        { service: 'Spotify', count: getStockCount('spotify.txt'), tier: 'PREMIUM', color: '#1DB954' },
        { service: 'Netflix', count: getStockCount('netflix.txt'), tier: 'PAID', color: '#E50914' }
    ];
    res.json(stock);
});

// Bot Login using Environment Variable (Safe)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

client.login(process.env.DISCORD_TOKEN); 

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
