const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`[READY] Bot đã online với tên: ${client.user.tag}!`);

    // Thiết lập trạng thái hoạt động của Bot
    client.user.setPresence({
      activities: [{ name: 'Việt Hóa Game | /game', type: ActivityType.Playing }],
      status: 'online',
    });
  },
};
