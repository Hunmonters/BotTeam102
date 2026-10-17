const fs = require('node:fs');
const path = require('node:path');

const configPath = path.join(__dirname, '..', 'data', 'config.json');

function getConfig() {
  try {
    if (!fs.existsSync(configPath)) {
      const defaultConfig = {
        welcomeChannelId: '',
        welcomeRoleId: '',
        ticketCategoryId: '',
        supportRoleId: '',
      };
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
      return defaultConfig;
    }
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Lỗi khi đọc config.json:', error);
    return {};
  }
}

function updateConfig(newValues) {
  try {
    const current = getConfig();
    const updated = { ...current, ...newValues };
    fs.writeFileSync(configPath, JSON.stringify(updated, null, 2), 'utf8');
    return updated;
  } catch (error) {
    console.error('Lỗi khi cập nhật config.json:', error);
    return null;
  }
}

module.exports = {
  getConfig,
  updateConfig,
};
