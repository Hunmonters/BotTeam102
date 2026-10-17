const express = require('express');
const path = require('node:path');
const { PermissionFlagsBits } = require('discord.js');
const { getConfig, updateConfig } = require('../utils/configManager');

function startDashboard(port = 3000, client = null) {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  // API lấy cấu hình hiện tại + thông tin Bot + danh sách Kênh
  app.get('/api/info', (req, res) => {
    const config = getConfig();
    const channels = [];

    if (client) {
      client.guilds.cache.forEach(guild => {
        const me = guild.members.me;
        guild.channels.cache
          .filter(c => c.isTextBased() && c.permissionsFor(me)?.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]))
          .sort((a, b) => a.position - b.position)
          .forEach(c => {
            channels.push({
              id: c.id,
              name: c.name,
              guildName: guild.name,
              guildId: guild.id,
            });
          });
      });
    }

    const botInfo = client ? {
      tag: client.user?.tag || 'Bot Chưa Online',
      avatar: client.user?.displayAvatarURL() || '',
      guildCount: client.guilds?.cache.size || 0,
      memberCount: client.guilds?.cache.reduce((acc, g) => acc + g.memberCount, 0) || 0,
      uptime: client.uptime || 0,
    } : { tag: 'Offline', avatar: '', guildCount: 0, memberCount: 0, uptime: 0 };

    res.json({ config, bot: botInfo, channels });
  });

  // API lưu cấu hình
  app.post('/api/config', (req, res) => {
    try {
      const newConfig = req.body;
      const updated = updateConfig(newConfig);
      res.json({ success: true, config: updated });
    } catch (error) {
      console.error('Lỗi khi lưu cấu hình qua dashboard:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  const server = app.listen(port, () => {
    console.log(`[DASHBOARD] Bảng điều khiển đã khởi động tại: http://localhost:${port}`);
  });

  return server;
}

module.exports = {
  startDashboard,
};
