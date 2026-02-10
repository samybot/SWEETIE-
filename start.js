module.exports = {
  nix: {
    name: 'start',
    prefix: false,
    role: 0,
    category: 'utility',
    aliases: ['help'],
  },

  async onStart({ message, bot }) {
    const cmds = global.teamnix?.cmds;
    if (!cmds) return;

    // 🔹 Build le message style box
    let text = `
┌ ❏ ◆ ⌜𝗦𝗪𝗘𝗘𝗧 𝗞𝗜𝗧𝗧𝗬 𝗕𝗢𝗧⌟ ◆
│
├◆ 📚 COMMANDES DISPONIBLES
`;

    const seen = new Set();
    for (const cmd of cmds.values()) {
      if (!seen.has(cmd.nix.name)) {
        seen.add(cmd.nix.name);
        text += `├◆ /${cmd.nix.name}\n`;
      }
    }

    text += `
│
└ ❏
┌ ❏ ◆ ⌜𝗖𝗥𝗘𝗔𝗧𝗢𝗥⌟ ◆
│
├◆ 👑 ⏤͟͟͞͞🍒🎸𝄒× •-•-•⟮ 𝐒𝐀𝐌 𝐀𝐑𝐂𝐅𝐎𝐗 ⟯•-•-• × ﹝⌨˓👑˒๖ۣ•҉📰🇨🇮
│
└ ❏
`;

    // 🔘 Boutons groupe / dev
    const keyboard = {
      inline_keyboard: [
        [
          { text: '🍒 Groupe', url: 'https://t.me/+AeazH36wrEcxM2Q0' },
          { text: '🧢 Dev', url: 'https://t.me/Samy_Charles_02' }
        ]
      ]
    };

    // 📤 Envoi du message help
    await message.reply(text.trim(), {
      reply_markup: keyboard
    });

    // ⏱ Petit délai pour que le message passe avant l’audio
    setTimeout(async () => {
      try {
        // 🔹 Transfert automatique de l’audio depuis le lien Telegram
        await bot.copyMessage(
          message.chat.id,
          '@axislaboffical', // canal d’origine
          9462                // ID du message audio dans le canal
        );
      } catch (e) {
        console.log('Erreur transfert audio:', e.message);
      }
    }, 1200);
  }
};
