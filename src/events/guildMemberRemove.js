const { Events, EmbedBuilder } = require('discord.js');
const { findWelcomeChannel } = require('../utils/channelDetector');

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    console.log(`[RỜI SERVER] ${member.user.tag} (${member.id}) vừa rời khỏi ${member.guild.name}`);

    // Tự động tìm kênh chào mừng / thông báo ra vào
    const channel = findWelcomeChannel(member.guild);
    if (!channel) {
      console.warn(`[CẢNH BÁO] Không tìm thấy kênh phù hợp để gửi thông báo rời khỏi tại server: ${member.guild.name}`);
      return;
    }

    const leaveEmbed = new EmbedBuilder()
      .setColor(0xE74C3C) // Màu đỏ cam thông báo rời đi
      .setTitle(`👋 THÀNH VIÊN RỜI MÁY CHỦ`)
      .setDescription(
        `Tạm biệt **${member.user.tag}** (**${member.user.username}**)!\n` +
        `Cảm ơn bạn đã đồng hành cùng cộng đồng trong thời gian qua.`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields({
        name: '👥 Số lượng thành viên hiện tại',
        value: `Server hiện còn lại **${member.guild.memberCount}** thành viên.`,
        inline: false,
      })
      .setFooter({ text: `${member.guild.name} • Hẹn gặp lại bạn!` })
      .setTimestamp();

    try {
      await channel.send({
        embeds: [leaveEmbed],
      });
      console.log(`[THÀNH CÔNG] Đã gửi thông báo rời khỏi tại kênh #${channel.name}`);
    } catch (err) {
      console.error('Lỗi khi gửi thông báo rời khỏi:', err);
    }
  },
};
