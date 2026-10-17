const { Events, EmbedBuilder } = require('discord.js');
const { findWelcomeChannel } = require('../utils/channelDetector');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    console.log(`[VÀO SERVER] ${member.user.tag} (${member.id}) vừa tham gia ${member.guild.name}`);

    // Tự động tìm kênh chào mừng
    const channel = findWelcomeChannel(member.guild);
    if (!channel) {
      console.warn(`[CẢNH BÁO] Không tìm thấy kênh phù hợp để gửi thông báo chào mừng tại server: ${member.guild.name}`);
      return;
    }

    const welcomeEmbed = new EmbedBuilder()
      .setColor(0x2ECC71) // Màu xanh lá tươi sáng
      .setTitle(`🎉 CHÀO MỪNG THÀNH VIÊN MỚI!`)
      .setDescription(
        `Xin chào <@${member.id}> (**${member.user.username}**), chào mừng bạn đã đến với **${member.guild.name}**!\n\n` +
        `🏆 Bạn là thành viên thứ **#${member.guild.memberCount}** của server.`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        {
          name: '🎮 Tra Cứu Bản Dịch',
          value: 'Gõ lệnh `/game` để tìm kiếm thông tin patch việt hóa các tựa game bạn quan tâm.',
          inline: true,
        },
        {
          name: '🚀 Cài Đặt Tự Động',
          value: 'Gõ lệnh `/launcher` để nhận link tải Launcher việt hóa 1-click.',
          inline: true,
        },
        {
          name: '🌐 Hệ Sinh Thái Team',
          value: 'Gõ `/social` để nhận link Website, Group Facebook và Kênh YouTube của nhóm.',
          inline: false,
        }
      )
      .setFooter({ text: `${member.guild.name} • Chúc bạn có trải nghiệm chơi game vui vẻ!` })
      .setTimestamp();

    try {
      await channel.send({
        content: `Chào mừng <@${member.id}> đã tham gia nhóm! 🎊`,
        embeds: [welcomeEmbed],
      });
      console.log(`[THÀNH CÔNG] Đã gửi thông báo chào mừng tại kênh #${channel.name}`);
    } catch (err) {
      console.error('Lỗi khi gửi thông báo chào mừng:', err);
    }
  },
};
