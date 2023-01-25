const { Scenes } = require('telegraf');

const unwrapCallback = async (ctx, nextScene) => {
    const nextSceneId = await Promise.resolve(nextScene(ctx));
    if (nextSceneId) return ctx.scene.enter(nextSceneId, ctx.scene.state);
    return ctx.scene.leave();
};

const composeWizardScene = (...advancedSteps) => {
    return (
        function createWizardScene(sceneType, nextScene) {
            return new Scenes.WizardScene(
                sceneType,
                ...advancedSteps.map((stepFn) => async (ctx, next) => {
                    if (!ctx.message && !ctx.callbackQuery) return undefined;
                    return stepFn(ctx, () => unwrapCallback(ctx, nextScene), next);
                }),
            );
        }
    );
};

module.exports = composeWizardScene;