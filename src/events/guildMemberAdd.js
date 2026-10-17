const { Events, EmbedBuilder } = require('discord.js');
const { findWelcomeChannel } = require('../utils/channelDetector');
const { getConfig } = require('../utils/configManager');

function parseTemplate(template, member) {
  if (!template) return '';
  return template
    .replace(/{user}/g, `<@${member.id}>`)
    .replace(/{username}/g, member.user.username)
    .replace(/{usertag}/g, member.user.tag)
    .replace(/{server}/g, member.guild.name)
    .replace(/{membercount}/g, member.guild.memberCount);
}

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const config = getConfig();
    const welcomeCfg = config.welcome || {};

    if (welcomeCfg.enabled === false) return;

    console.log(`[VÀO SERVER] ${member.user.tag} (${member.id}) vừa tham gia ${member.guild.name}`);

    // 1. Kiểm tra xem người dùng có chọn kênh cụ thể không
    let channel = null;
    if (welcomeCfg.channelId) {
      channel = member.guild.channels.cache.get(welcomeCfg.channelId);
    }

    // 2. Nếu chưa thiết lập hoặc kênh đã bị xóa, tự động tìm kênh phù hợp
    if (!channel) {
      channel = findWelcomeChannel(member.guild);
    }

    if (!channel) {
      console.warn(`[CẢNH BÁO] Không tìm thấy kênh để gửi chào mừng tại: ${member.guild.name}`);
      return;
    }

    const title = parseTemplate(welcomeCfg.title || '🎉 CHÀO MỪNG ĐẾN VỚI {server}!', member);
    const description = parseTemplate(
      welcomeCfg.description || 'Xin chào {user}, chào mừng bạn đã gia nhập cộng đồng!\n\n🏆 Bạn là thành viên thứ **#{membercount}**.',
      member
    );
    const footerText = parseTemplate(welcomeCfg.footer || '{server}', member);
    const embedColor = welcomeCfg.color ? parseInt(welcomeCfg.color.replace('#', ''), 16) : 0x2ECC71;

    const welcomeEmbed = new EmbedBuilder()
      .setColor(embedColor)
      .setAuthor({
        name: `${member.user.tag} đã gia nhập máy chủ`,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setTitle(title)
      .setDescription(description)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({
        text: footerText,
        iconURL: member.guild.iconURL({ dynamic: true }) || undefined,
      })
      .setTimestamp();

    try {
      await channel.send({
        content: `Chào mừng <@${member.id}> gia nhập **${member.guild.name}**! 🎊`,
        embeds: [welcomeEmbed],
      });
      console.log(`[THÀNH CÔNG] Đã gửi chào mừng tại kênh #${channel.name}`);
    } catch (err) {
      console.error('Lỗi khi gửi thông báo chào mừng:', err);
    }
  },
};
