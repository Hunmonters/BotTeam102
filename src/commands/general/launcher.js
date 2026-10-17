const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('launcher')
    .setDescription('Hướng dẫn và link tải phần mềm Launcher cài việt hóa tự động'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0xE67E22)
      .setTitle('🚀 Launcher Cài Đặt Việt Hóa Tự Động')
      .setDescription(
        '**Launcher Việt Hóa** là công cụ giúp bạn cài đặt, cập nhật và gỡ bỏ các bản dịch game chỉ với 1 click chuột!\n\n' +
        '**Ưu điểm:**\n' +
        '• Tự động nhận diện thư mục game (Steam, Epic Games, GOG...)\n' +
        '• Cập nhật bản dịch mới nhất không cần tải lại file zip\n' +
        '• Hỗ trợ khôi phục lại ngôn ngữ gốc bất cứ lúc nào\n\n' +
        '**⚠️ Lưu ý khi cài đặt:**\n' +
        '• Nếu Windows Defender / Trình duyệt báo `Tệp không phổ biến` (False Positive), hãy chọn `More info -> Run anyway`.\n' +
        '• Nên chạy Launcher dưới quyền `Run as Administrator` (Chạy với quyền quản trị).'
      )
      .addFields(
        { name: '📥 Tải về Launcher', value: '[Link Tải Trực Tiếp](https://your-website.com/launcher)', inline: true },
        { name: '📖 Hướng dẫn sử dụng', value: '[Xem bài viết chi tiết](https://your-website.com/huong-dan-launcher)', inline: true }
      )
      .setFooter({ text: 'Cần hỗ trợ kỹ thuật? Dùng lệnh /faq hoặc mở ticket hỗ trợ' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Tải Launcher Mới Nhất')
        .setStyle(ButtonStyle.Link)
        .setURL('https://your-website.com/launcher'),
      new ButtonBuilder()
        .setLabel('Video Hướng Dẫn')
        .setStyle(ButtonStyle.Link)
        .setURL('https://youtube.com/@your-channel')
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
