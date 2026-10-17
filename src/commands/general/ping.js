const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Kiểm tra độ trễ phản hồi của Bot'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Đang đo độ trễ...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(0x00FF7F)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Độ trễ bot', value: `\`${latency}ms\``, inline: true },
        { name: 'Độ trễ Discord API', value: `\`${apiLatency}ms\``, inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ content: null, embeds: [embed] });
  },
};
