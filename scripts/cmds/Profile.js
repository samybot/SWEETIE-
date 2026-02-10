module.exports = {
  nix: {
    name: 'profile',
    prefix: true,
    role: 0,
    category: 'utility',
    aliases: ['user', 'info'],
  },

  async onStart({ message, bot, args }) {
    if (!message || !message.from) return;

    const chatId = message.chat.id;
    let targetUser = message.from; // par défaut, soi-même

    // ⚡ Vérifie si mentionné
    if (args && args[0]) {
      try {
        const username = args[0].replace('@','');
        const members = await bot.getChatAdministrators(chatId); 
        const found = members.find(m => m.user.username?.toLowerCase() === username.toLowerCase());
        if (found) targetUser = found.user;
      } catch (e) {
        console.log("Erreur récupération user:", e.message);
      }
    }

    try {
      // Photo de profil
      let profilePhotos = await bot.getUserProfilePhotos(targetUser.id, 0, 1);
      let photoId = profilePhotos.total_count > 0 ? profilePhotos.photos[0][0].file_id : null;

      // ⚡ Statistiques fictives (remplacer par compteur réel)
      const messageCount = targetUser.message_count || 0;
      const warnCount = targetUser.warn_count || 0;
      const role = targetUser.is_bot ? '🤖 Bot' : '👤 Utilisateur';
      const usernameDisplay = targetUser.username ? `@${targetUser.username}` : 'N/A';
      const joinedDate = targetUser.joined_date || 'N/A';
      const language = targetUser.language_code || 'N/A';
      const isAdmin = targetUser.is_admin ? '👑 Admin' : '👥 Membre';
      const status = targetUser.is_bot ? '🤖 Bot' : '🟢 Actif';

      // Ping approximation
      const start = Date.now();
      await bot.sendChatAction(chatId, 'typing');
      const ping = Date.now() - start;

      // Message Sweet Kitty MAX
      let profileMsg = `
┌ ❏ ◆ ⌜🐾 𝐏𝐑𝐎𝐅𝐈𝐋𝐄  𓆉 ⌟ ◆
│
├🎀 Nom complet: ${targetUser.first_name} ${targetUser.last_name || 'N/A'}
├💌 Pseudo: ${usernameDisplay}
├🆔 Telegram ID: ${targetUser.id}
├🎭 Statut: ${status} | Rôle: ${isAdmin}
├⚡ Ping: ${ping}ms
├📨 Messages envoyés: ${messageCount} 💬
├⚠️ Warns: ${warnCount}/3
├📅 Date d’inscription: ${joinedDate}
├🌐 Langue: ${language}
├🖥️ Bot: ${targetUser.is_bot ? 'Oui 🤖' : 'Non 👤'}
├🛡️ Vérifié: ${targetUser.is_verified ? '✅' : '❌'}
├💎 Premium: ${targetUser.is_premium ? '✨ Oui' : '❌ Non'}
├🎯 Mentionable: ${targetUser.can_be_mentioned ? '✅' : '❌'}
├📎 Partage de média: ${targetUser.can_send_media_messages ? '✅' : '❌'}
├📹 Appels vidéo: ${targetUser.can_send_video_messages ? '✅' : '❌'}
├📤 Partage de lien: ${targetUser.can_add_web_page_previews ? '✅' : '❌'}
├🖇️ Ajouter à groupe: ${targetUser.can_join_groups ? '✅' : '❌'}
├📝 Bio: ${targetUser.bio || 'N/A'}
│
└ ❏
`;

      // Envoie la photo si dispo
      if (photoId) {
        await bot.sendPhoto(chatId, photoId, { caption: profileMsg });
      } else {
        await bot.sendMessage(chatId, profileMsg);
      }

    } catch (e) {
      console.log("Erreur profile MAX:", e.message);
      await bot.sendMessage(chatId, "❌ Impossible de récupérer le profil.");
    }
  }
};
