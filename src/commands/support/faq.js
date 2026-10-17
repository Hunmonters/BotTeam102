const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Giải đáp các lỗi thường gặp khi cài đặt bản dịch hoặc sử dụng Launcher'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle('🛠️ Câu Hỏi Thường Gặp & Hướng Dẫn Sửa Lỗi')
      .setDescription('Dưới đây là các lỗi người chơi hay gặp phải nhất và cách khắc phục nhanh chóng:')
      .addFields(
        {
          name: '1️⃣ Bị Windows Defender / Antivirus chặn hoặc xóa file',
          value: '• Nguyên nhân: Trình diệt virus hiểu nhầm file can thiệp dịch thuật (`.dll`, `.exe`).\n• Cách xử lý: Tạm thời tắt `Real-time protection` hoặc thêm thư mục game/launcher vào mục Loại trừ (`Exclusions`) của Windows Security.'
        },
        {
          name: '2️⃣ Lỗi font chữ hiển thị ô vuông hoặc mất chữ',
          value: '• Nguyên nhân: Cài đặt sai phiên bản game hoặc chưa cài đủ font đi kèm.\n• Cách xử lý: Kiểm tra lại phiên bản patch có đúng với bản game bạn đang chơi hay không.'
        },
        {
          name: '3️⃣ Vào game bị văng (Crash to Desktop)',
          value: '• Nguyên nhân: File game bị xung đột, mod khác can thiệp, hoặc bản quyền cập nhật làm lệch offset.\n• Cách xử lý: Verify integrity of game files (trên Steam/Epic) rồi tiến hành cài lại patch.'
        },
        {
          name: '4️⃣ Launcher không tự tìm thấy game',
          value: '• Cách xử lý: Bấm nút `Chọn đường dẫn thủ công` trong Launcher và trỏ đến thư mục chứa file `.exe` của game.'
        }
      )
      .setFooter({ text: 'Nếu vẫn gặp sự cố, hãy tag đội ngũ Hỗ Trợ Kỹ Thuật nhé!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
