import { Group as TweenGroup, Tween } from "@tweenjs/tween.js";

/**
 *  @param {TweenGroup} TweenAnimationGroup
 * @param {Tween} tween
 *  **/
export function chainAnimations(TweenAnimationGroup, tween) {
    TweenAnimationGroup.add(tween);

    const groupTweens = TweenAnimationGroup.getAll();

    if (groupTweens.length === 1) {
        tween.start();
        tween.onComplete(() => {
            TweenAnimationGroup.remove(tween);
            const newGroupTweens = TweenAnimationGroup.getAll();
            if (newGroupTweens.length > 0) {
                
                const tweenToPlay = newGroupTweens[0];

                if (!tweenToPlay.isPlaying()) chainAnimations(TweenAnimationGroup, tweenToPlay);

            }
        });
    } else {
        const tailTween = groupTweens[groupTweens.length - 1].chain(tween);
        TweenAnimationGroup.remove(groupTweens[groupTweens.length - 1]);
        TweenAnimationGroup.add(tailTween);
    }
}
