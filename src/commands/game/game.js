const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const games = require('../../data/games.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('game')
    .setDescription('Tra cứu bản dịch việt hóa của một tựa game')
    .addStringOption(option =>
      option.setName('ten')
        .setDescription('Tên game cần tra cứu (ví dụ: Wukong, Elden Ring, Silent Hill...)')
        .setRequired(false)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('ten');

    if (!query) {
      // Hiển thị danh sách các game nổi bật
      const embed = new EmbedBuilder()
        .setColor(0x00A8FF)
        .setTitle('🎮 Danh Sách Các Bản Dịch Tiêu Biểu')
        .setDescription('Bạn có thể gõ `/game ten:<tên_game>` để tìm chi tiết bản dịch cụ thể.')
        .addFields(
          games.map(g => ({
            name: `${g.status.includes('Hoàn thành') ? '✅' : '⏳'} ${g.name}`,
            value: `• **Trạng thái:** ${g.status}\n• **Hỗ trợ Launcher:** ${g.launcherSupported ? 'Có' : 'Cài thủ công'}\n• [Xem chi tiết](${g.webUrl})`,
            inline: false
          }))
        )
        .setFooter({ text: 'Team Việt Hóa Game • Tra cứu game việt hóa' })
        .setTimestamp();

      return await interaction.reply({ embeds: [embed] });
    }

    const cleanQuery = query.toLowerCase().trim();
    const matched = games.filter(g =>
      g.name.toLowerCase().includes(cleanQuery) ||
      (g.aliases && g.aliases.some(alias => alias.toLowerCase().includes(cleanQuery)))
    );

    if (matched.length === 0) {
      const notFoundEmbed = new EmbedBuilder()
        .setColor(0xE74C3C)
        .setTitle('❌ Không tìm thấy bản dịch')
        .setDescription(`Không tìm thấy game nào khớp với từ khóa **"${query}"**.\n\n• Hãy thử tra cứu với từ khóa ngắn hơn.\n• Bạn cũng có thể vào [Website](https://your-website.com) để tìm kiếm thêm.`)
        .setFooter({ text: 'Gợi ý: Dùng /game để xem danh sách game có sẵn' });

      return await interaction.reply({ embeds: [notFoundEmbed] });
    }

    const game = matched[0];
    const embed = new EmbedBuilder()
      .setColor(game.status.includes('Hoàn thành') ? 0x2ECC71 : 0xF1C40F)
      .setTitle(`🎮 ${game.name}`)
      .setDescription(game.description || 'Chưa có mô tả chi tiết.')
      .addFields(
        { name: '📌 Tình trạng', value: `\`${game.status}\``, inline: true },
        { name: '🏷️ Phiên bản', value: `\`${game.version}\``, inline: true },
        { name: '🚀 Hỗ trợ Launcher', value: game.launcherSupported ? '✅ Đã có trên Launcher' : '⚠️ Cài patch thủ công', inline: true },
        { name: '✍️ Nhóm thực hiện', value: game.translator, inline: false }
      )
      .setFooter({ text: 'Bản dịch thuộc quyền sở hữu của Team Việt Hóa' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Trang Bài Viết & Tải Về')
        .setStyle(ButtonStyle.Link)
        .setURL(game.webUrl)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
