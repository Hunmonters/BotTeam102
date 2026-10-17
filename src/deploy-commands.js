const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`[CẢNH BÁO] Lệnh tại ${filePath} thiếu trường "data" hoặc "execute".`);
    }
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Đang đăng ký ${commands.length} lệnh Slash Command...`);

    let data;
    if (process.env.GUILD_ID) {
      // Đăng ký cho riêng server (cập nhật ngay lập tức)
      data = await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands },
      );
      console.log(`✅ Đã đăng ký thành công ${data.length} lệnh cho Server: ${process.env.GUILD_ID}`);
    } else {
      // Đăng ký toàn cầu (Global)
      data = await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands },
      );
      console.log(`✅ Đã đăng ký thành công ${data.length} lệnh Toàn Cầu (Global)!`);
    }
  } catch (error) {
    console.error('❌ Lỗi khi đăng ký lệnh:', error);
  }
})();
