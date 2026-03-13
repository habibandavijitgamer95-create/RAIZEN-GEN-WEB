const express = require('express');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const cors = require('cors');
const fs = require('fs');
const app = express();

const BOT_TOKEN = 'MTQ3OTE4ODQyNTI2ODUyNzI4OQ.Gv_SjE.xUIh8CgJQhlCB7XRvB-JZ9o6qnOhlNRRv3j5AM';
const VOUCH_CHANNEL_ID = '1482098394729152593';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages] });
app.use(cors());
app.use(express.json());

// Helper function to count stock from .txt files
function getStockCount(filename) {
    try {
        const data = fs.readFileSync(`./stock/${filename}`, 'utf8');
        return data.split('\n').filter(line => line.trim() !== '').length;
    } catch (e) { return 0; }
}

app.get('/api/stock', (req, res) => {
    const stock = [
        { tier: 'FREE', service: 'CRUNCHYROLL', count: getStockCount('crunchyroll.txt'), color: '#10b981' },
        { tier: 'PREMIUM', service: 'SPOTIFY', count: getStockCount('spotify.txt'), color: '#a855f7' },
        { tier: 'PAID', service: 'NETFLIX', count: getStockCount('netflix.txt'), color: '#f59e0b' }
    ];
    res.json(stock);
});

app.post('/api/generate', async (req, res) => {
    const { userId, service, tier } = req.body;
    try {
        const user = await client.users.fetch(userId);
        
        // DM the user
        await user.send(`🚀 **ZETUGEN DELIVERY**\nService: ${service}\nAccount: \`example:user123\``);

        // Vouch in channel
        const channel = await client.channels.fetch(VOUCH_CHANNEL_ID);
        const embed = new EmbedBuilder()
            .setTitle('✅ NEW VOUCH')
            .setDescription(`**+vouch ZETU GEN**\nUser: <@${userId}>\nService: ${service}\nTier: ${tier}`)
            .setColor('#10b981').setTimestamp();
        await channel.send({ embeds: [embed] });

        res.json({ success: true, message: "Check your DMs!" });
    } catch (e) { res.status(500).json({ success: false, message: "Failed to send DM." }); }
});

client.login(BOT_TOKEN);
app.listen(3000, () => console.log("Server running on port 3000"));
