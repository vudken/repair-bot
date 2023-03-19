const mediaHandler = async (ctx) => {
    const mediaGroup = ctx.mediaGroup;

    if (ctx.wizard && ctx.wizard.state.job.cause.length > 0) {
        const msg = ctx.update.message, photos = ctx.wizard.state.job.photos;

        if (mediaGroup) {
            for (const msg of mediaGroup) {
                photos.push({ path: await getPhotoPath(msg.photo) });
            }
        } else {
            photos.push({ path: await getPhotoPath(msg.photo) });
        }

        return await ctx.reply(
            `<b>Адрес:</b> <i>${ctx.wizard.state.work.address}</i>\n\n<b>Кол-во добавленных фото:</b> <i>${photos.length}</i>\n\n<b>Можете прикрепить ещё фото. Если все фото добавлены, можете завершить работу или добавить ещё место выполнения работы (например, чердак, подвал или т.п.)</b>`,
            keyboard.getConfirmationKeyboard()
        );
    } else {
        if (mediaGroup) {
            for (const msg of mediaGroup) {
                ctx.deleteMessage(msg.message_id);
            }
        } else {
            ctx.deleteMessage();
        }

        return ctx.reply(
            TEXT.INFO.PHOTO_WARNING,
            keyboard.getPhotoWarningKeyboard()
        );
    }
};

const sceneIdHandler = (ctx) => {
    const state = ctx.wizard ? ctx.wizard.state : null;
    ctx.scene.leave();
    return ctx.scene.enter(ctx.update.callback_query.data, state);
};

module.exports = {
    mediaHandler,
    sceneIdHandler
};