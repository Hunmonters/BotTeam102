const { PermissionFlagsBits } = require('discord.js');

/**
 * Tự động tìm kiếm kênh Chào mừng / Rời khỏi phù hợp nhất trong Server
 * @param {import('discord.js').Guild} guild 
 * @returns {import('discord.js').TextChannel | null}
 */
function findWelcomeChannel(guild) {
  const me = guild.members.me;
  if (!me) return null;

  // 1. Ưu tiên Kênh Hệ Thống (System Channel) của Server nếu Bot có quyền gửi tin
  if (
    guild.systemChannel &&
    guild.systemChannel.permissionsFor(me)?.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages])
  ) {
    return guild.systemChannel;
  }

  // 2. Tìm kênh theo từ khóa thông dụng: chao-mung, welcome, thanh-vien, ra-vao...
  const welcomeKeywords = /chao[-_]?mung|chào[-_]?mừng|welcome|thanh[-_]?vien|thành[-_]?viên|nhap[-_]?canh|ra[-_]?vao|cua[-_]?vao|member/i;
  const keywordChannel = guild.channels.cache.find(
    c =>
      c.isTextBased() &&
      c.permissionsFor(me)?.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]) &&
      welcomeKeywords.test(c.name)
  );

  if (keywordChannel) return keywordChannel;

  // 3. Tìm kênh chung/thảo luận nếu không có kênh chào mừng riêng
  const generalKeywords = /general|chung|thao[-_]?luan|chat[-_]?tong|sanh[-_]?cho/i;
  const generalChannel = guild.channels.cache.find(
    c =>
      c.isTextBased() &&
      c.permissionsFor(me)?.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]) &&
      generalKeywords.test(c.name)
  );

  if (generalChannel) return generalChannel;

  // 4. Lấy bất kỳ kênh văn bản đầu tiên nào mà bot có quyền gửi tin
  return guild.channels.cache.find(
    c =>
      c.isTextBased() &&
      c.permissionsFor(me)?.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages])
  ) || null;
}

module.exports = {
  findWelcomeChannel,
};
