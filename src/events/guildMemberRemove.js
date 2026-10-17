const { Events, EmbedBuilder } = require('discord.js');
const { findWelcomeChannel } = require('../utils/channelDetector');
const { getConfig } = require('../utils/configManager');

function parseTemplate(template, member) {
  if (!template) return '';
  return template
    .replace(/{username}/g, member.user.username)
    .replace(/{usertag}/g, member.user.tag)
    .replace(/{server}/g, member.guild.name)
    .replace(/{membercount}/g, member.guild.memberCount);
}

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    const config = getConfig();
    const goodbyeCfg = config.goodbye || {};

    if (goodbyeCfg.enabled === false) return;

    console.log(`[RỜI SERVER] ${member.user.tag} (${member.id}) vừa rời khỏi ${member.guild.name}`);

    // 1. Kiểm tra xem người dùng có chọn kênh cụ thể không
    let channel = null;
    if (goodbyeCfg.channelId) {
      channel = member.guild.channels.cache.get(goodbyeCfg.channelId);
    }

    // 2. Nếu chưa thiết lập hoặc kênh đã bị xóa, tự động tìm kênh phù hợp
    if (!channel) {
      channel = findWelcomeChannel(member.guild);
    }

    if (!channel) {
      console.warn(`[CẢNH BÁO] Không tìm thấy kênh để gửi thông báo rời khỏi tại: ${member.guild.name}`);
      return;
    }

    const title = parseTemplate(goodbyeCfg.title || '👋 THÀNH VIÊN RỜI MÁY CHỦ', member);
    const description = parseTemplate(
      goodbyeCfg.description || 'Tạm biệt **{username}**!\nServer hiện còn **{membercount}** thành viên.',
      member
    );
    const footerText = parseTemplate(goodbyeCfg.footer || '{server}', member);
    const embedColor = goodbyeCfg.color ? parseInt(goodbyeCfg.color.replace('#', ''), 16) : 0xE74C3C;

    const leaveEmbed = new EmbedBuilder()
      .setColor(embedColor)
      .setAuthor({
        name: `${member.user.tag} đã rời khỏi máy chủ`,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setTitle(title)
      .setDescription(description)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields({
        name: '👥 Quy mô cộng đồng',
        value: `Hiện còn lại **${member.guild.memberCount}** thành viên.`,
        inline: false,
      })
      .setFooter({
        text: footerText,
        iconURL: member.guild.iconURL({ dynamic: true }) || undefined,
      })
      .setTimestamp();

    try {
      await channel.send({ embeds: [leaveEmbed] });
      console.log(`[THÀNH CÔNG] Đã gửi thông báo rời khỏi tại kênh #${channel.name}`);
    } catch (err) {
      console.error('Lỗi khi gửi thông báo rời khỏi:', err);
    }
  },
};
