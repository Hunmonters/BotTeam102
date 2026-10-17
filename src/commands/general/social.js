const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('social')
    .setDescription('Xem toàn bộ liên kết Website, Facebook, YouTube và Launcher của nhóm'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('🌐 Hệ Sinh Thái Team Việt Hóa')
      .setDescription('Dưới đây là các kênh chính thức của nhóm. Hãy theo dõi để không bỏ lỡ các bản việt hóa mới nhất nhé!')
      .addFields(
        { name: '🌐 Website', value: '[Truy cập Website Việt Hóa](https://your-website.com)', inline: true },
        { name: '👥 Facebook Group', value: '[Tham gia Group Thảo Luận](https://facebook.com/groups/your-group)', inline: true },
        { name: '📺 YouTube Channel', value: '[Xem Video Việt Hóa](https://youtube.com/@your-channel)', inline: true },
        { name: '🚀 Phần Mềm Launcher', value: 'Dùng lệnh `/launcher` để nhận link tải và hướng dẫn cài đặt!', inline: false }
      )
      .setFooter({ text: 'Team Việt Hóa Game • Uy Tín & Chất Lượng' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Trang Chủ Website')
        .setStyle(ButtonStyle.Link)
        .setURL('https://your-website.com'),
      new ButtonBuilder()
        .setLabel('Group Facebook')
        .setStyle(ButtonStyle.Link)
        .setURL('https://facebook.com/groups/your-group'),
      new ButtonBuilder()
        .setLabel('Kênh YouTube')
        .setStyle(ButtonStyle.Link)
        .setURL('https://youtube.com/@your-channel')
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
