// Stockage en mémoire
const warnSettings = {}; // chatId => true/false
const userWarns = {};    // key = chatId_userId => nombre de warns

module.exports = {
  nix: {
    name: 'warn',
    prefix: false,
    role: 2, // Admin
    category: 'admin',
    aliases: [],
  },

  // Commande pour activer / désactiver
  async onStart({ message, bot }) {
    if (!message || !message.from) return; // Sécurité
    const chatId = message.chat.id;
    const sender = message.from;

    // Vérifie que l'utilisateur est admin
    const chatAdmins = await bot.getChatAdministrators(chatId);
    const isAdmin = chatAdmins.some(a => a.user.id === sender.id);
    if (!isAdmin) return message.reply("❌ Seul un admin peut activer/désactiver le système.");

    const cmd = message.text.toLowerCase();

    if (cmd === '/warn-on') {
      warnSettings[chatId] = true;
      return message.reply("✅ Anti-liens activé ! Je surveillerai tous les liens envoyés dans ce groupe.");
    }

    if (cmd === '/warn-off') {
      warnSettings[chatId] = false;
      return message.reply("⚠️ Anti-liens désactivé. Les messages contenant des liens ne seront plus supprimés.");
    }

    message.reply("ℹ️ Utilise `/warn-on` ou `/warn-off` pour activer/désactiver le système.");
  },

  // Handler pour tous les messages
  async onMessage({ message, bot }) {
    if (!message || !message.from || !message.chat) return;

    const chatId = message.chat.id;
    const userId = message.from.id;

    // Vérifie si le système est activé dans ce chat
    if (!warnSettings[chatId]) return;

    // Ignore les messages sans texte
    if (!message.text) return;

    // Regex liens interdits
    const linkRegex = /(https?:\/\/\S+|t\.me\/\S+|discord\.gg\/\S+)/gi;
    if (!linkRegex.test(message.text)) return;

    const key = `${chatId}_${userId}`;

    try {
      // Supprime le message contenant le lien
      await bot.deleteMessage(chatId, message.message_id);

      // Compteur warn
      if (!userWarns[key]) userWarns[key] = 0;
      userWarns[key]++;

      // Message Sweet Kitty kawaii
      if (userWarns[key] < 3) {
        await bot.sendMessage(chatId,
`┌ ❏ ◆ ⌜⚠️ AVERTISSEMENT ⚠️⌟ ◆
│
├◆ Salut ${message.from.first_name} 🐱🍒
├◆ Tu as envoyé un lien interdit dans le groupe.
├◆ C'est ton avertissement n°${userWarns[key]}/3.
├◆ Merci de faire attention pour rester dans le groupe !
│
└ ❏`);
      } else {
        // Kick après 3 warns
        await bot.kickChatMember(chatId, userId);
        await bot.sendMessage(chatId,
`┌ ❏ ◆ ⌜⛔ UTILISATEUR EXPULSÉ ⌟ ◆
│
├◆ ${message.from.first_name} a atteint 3 avertissements.
├◆ Les liens interdits ont été supprimés.
├◆ Bye bye 😿
│
└ ❏`);
        userWarns[key] = 0; // Reset après kick
      }

    } catch (e) {
      console.log("Erreur Anti-Liens:", e.message);
    }
  }
};
