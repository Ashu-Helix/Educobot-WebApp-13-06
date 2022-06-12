export function loadCanvasItems(slug) {
    var ctext = {}
    var startAnimating, reset, sampleCode
    if (!slug) return
    try {
        const slugExports = require(`../../public/anim/${slug}`)

        Object.keys(slugExports).forEach(key => {
            if (key !== 'startAnimating' && key !== 'reset_output' && key !== 'sampleCode') {
                ctext[`${key}`] = slugExports[key];
                window[`${key}`] = slugExports[key];
            }
        })

        startAnimating = slugExports['startAnimating']
        reset = slugExports['reset_output']
        sampleCode = slugExports['sampleCode']

        window[`startAnimating`] = slugExports["startAnimating"];
        window[`reset_output`] = slugExports["reset_output"];
    } catch (error) {
        console.log(error)
    }
    return { ctext, startAnimating, reset, sampleCode }
    // if (slug === 'dog') {
    //     if (file) {
    //         const dog = new Function("return " + file)()
    //         let { move, eatBone, sleep, enterHouse, turn, startAnimatingDog, resetDog } = dog()
    //         ctext["move"] = move;
    //         ctext["eatBone"] = eatBone;
    //         ctext["turn"] = turn;
    //         ctext["sleep"] = sleep;
    //         ctext["enterHouse"] = enterHouse;
    //         startAnimating = startAnimatingDog
    //         reset = resetDog
    //     }
    //     sampleCode = 'import dog\ndog.moveUp()\ndog.eatBone()\ndog.sleep(1000)\ndog.moveDown();'
    // }

    // if (slug === 'app') {
    //     if (file) {
    //         console.log(file)
    //         const bunny = new Function("return " + file)()
    //         let { right, left, eatCarrot, reset_output } = bunny()
    //         ctext["left"] = left;
    //         ctext["right"] = right;
    //         ctext["eatCarrot"] = eatCarrot;
    //         startAnimating = reset_output
    //         reset = reset_output
    //     }
    //     sampleCode = 'import bunny\nbunny.left(40)\nbunny.eatCarrot()\n'
    // }
    // if (slug === 'bunny') {
    //     if (file) {
    //         const bunny = new Function("return " + file)()
    //         let { right, left, eatCarrot, reset_output } = bunny()
    //         ctext["left"] = left;
    //         ctext["right"] = right;
    //         ctext["eatCarrot"] = eatCarrot;
    //         startAnimating = reset_output
    //         reset = reset_output
    //     }
    //     sampleCode = 'import bunny\nbunny.left(40)\nbunny.eatCarrot()\n'
    // }

    //let { right, left, eatCarrot, reset_output } = require("../../public/anim/bunny")
    // ctext["left"] = left;
    // ctext["right"] = right;
    // ctext["eatCarrot"] = eatCarrot;
    //startAnimating = reset_output
    //reset = reset_output
    // sampleCode = 'import bunny\nbunny.left(40)\nbunny.eatCarrot()\n'
    // return { ctext, startAnimating, reset, sampleCode }
}
