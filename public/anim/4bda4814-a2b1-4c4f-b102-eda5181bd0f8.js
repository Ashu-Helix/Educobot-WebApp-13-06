import M from "materialize-css";
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
const demoWorkspace = Blockly.getMainWorkspace();

var isStageCompleted = false;
var ctr = 0;
var then = Date.now();
var up_running = false;
var down_running = false;
var left_running = false;
var right_running = false;
var carrot_eating_running = false;
var carrot_available = true;
var player_visit_history = [];
const canvas = document.getElementById("sprite");
const ctx = canvas.getContext("2d");
canvas.width = 4300;
canvas.height = 2420;
const player = {
    x: -100,
    y: 1270,
    width: 100,
    height: 119,
    frameX: 0,
    frameY: 0,
    speed: 90,
    moving: false,
    display_factor: 6,
};
const carrot_ = { x: 3750, y: 1720, width: 250, height: 250 };
const box1 = { x: 0, y: 0, width: 4000, height: 800 };
const box2 = { x: 0, y: 2600, width: 4000, height: 200 };
const factory = { x: 3500, y: 800, width: 800, height: 1800 };
const home = { x: 0, y: 800, width: 1000, height: 1800 };
const playerSprite = new Image();
// https://app.educobot.com/1/img/
playerSprite.src = "https://app.educobot.com/1/img/Bunny_2_lowres.png";
const bg = new Image();
bg.src = "https://app.educobot.com/1/img/forest_2_for_bunny.png";
const carrot = new Image();
carrot.src = "https://app.educobot.com/1/img/carrot.png";

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}
bg.onload = function () {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    drawSprite(
        playerSprite,
        player.width * player.frameX,
        player.height * player.frameY,
        player.width,
        player.height,
        player.x,
        player.y,
        player.width * player.display_factor,
        player.height * player.display_factor
    );
    ctx.drawImage(carrot, carrot_.x, carrot_.y, carrot_.width, carrot_.height);
};
drawSprite(
    playerSprite,
    player.width * player.frameX,
    player.height * player.frameY,
    player.width,
    player.height,
    player.x,
    player.y,
    player.width * player.display_factor,
    player.height * player.display_factor
);

function reset_output(ctxt, canvas1) {
    if (!(
        up_running ||
        down_running ||
        left_running ||
        right_running ||
        carrot_eating_running
    )) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        player_visit_history = [];
        player.x = -100;
        player.y = 1270;
        player.frameX = 0;
        player.frameY = 0;
        carrot_available = true;
        drawSprite(
            playerSprite,
            player.width * player.frameX,
            player.height * player.frameY,
            player.width,
            player.height,
            player.x,
            player.y,
            player.width * player.display_factor,
            player.height * player.display_factor
        );
        ctx.drawImage(carrot, carrot_.x, carrot_.y, carrot_.width, carrot_.height);
    }
}

function handlePlayerFrame() {
    if (player.frameX < 7 && player.moving) player.frameX++;
    else player.frameX = 0;
}

function eatCarrot() {
    const anim = requestAnimationFrame(eatCarrot);
    if (!(up_running || down_running || right_running || left_running)) {
        if (Date.now() - then > 70) {
            carrot_eating_running = true;
            const col_check = collision(player, factory);
            if (carrot_available && col_check) {
                carrot_available = false;
                sleep(300);
            } else if (!carrot_available && col_check)
                M.toast({ html: "Carrot is already Eaten!" });
            else if (carrot_available && !col_check)
                M.toast({ html: "Carrot is not in Bunny's reach!" });
            cancelAnimationFrame(anim);
            carrot_eating_running = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            drawSprite(
                playerSprite,
                player.width * player.frameX,
                player.height * player.frameY,
                player.width,
                player.height,
                player.x,
                player.y,
                player.width * player.display_factor,
                player.height * player.display_factor
            );
            if (carrot_available)
                ctx.drawImage(
                    carrot,
                    carrot_.x,
                    carrot_.y,
                    carrot_.width,
                    carrot_.height
                );
            sleep(300);
        }
        then = Date.now();
    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function left(move_distance) {
    const anim = requestAnimationFrame(function () {
        left(move_distance);
    });
    if (!(up_running || down_running || right_running || carrot_eating_running)) {
        if (Date.now() - then > 70) {
            left_running = true;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            drawSprite(
                playerSprite,
                player.width * player.frameX,
                player.height * player.frameY,
                player.width,
                player.height,
                player.x,
                player.y,
                player.width * player.display_factor,
                player.height * player.display_factor
            );
            if (carrot_available)
                ctx.drawImage(
                    carrot,
                    carrot_.x,
                    carrot_.y,
                    carrot_.width,
                    carrot_.height
                );
            ctr += 1;
            if (ctr > move_distance || player.x < -10) {
                ctr = 0;
                cancelAnimationFrame(anim);
                player.moving = false;
                left_running = false;
                collision_check();
                evaluate_task();
                if (player.x < -15) M.toast({ html: "End of screen!" });
                return;
            }
            player.x -= player.speed;
            player.frameY = 1;
            player.moving = true;
            handlePlayerFrame();
            then = Date.now();
        }
    }
}

function right(move_distance) {
    const anim = requestAnimationFrame(function () {
        right(move_distance);
    });
    if (!(up_running || left_running || down_running || carrot_eating_running)) {
        if (Date.now() - then > 70) {
            right_running = true;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            drawSprite(
                playerSprite,
                player.width * player.frameX,
                player.height * player.frameY,
                player.width,
                player.height,
                player.x,
                player.y,
                player.width * player.display_factor,
                player.height * player.display_factor
            );
            if (carrot_available)
                ctx.drawImage(
                    carrot,
                    carrot_.x,
                    carrot_.y,
                    carrot_.width,
                    carrot_.height
                );
            ctr += 1;
            if (
                ctr > move_distance ||
                player.x > canvas.width - player.width * player.display_factor + 10
            ) {
                ctr = 0;
                cancelAnimationFrame(anim);
                player.moving = false;
                right_running = false;
                collision_check();
                //evaluate_task();
                if (player.x > canvas.width - player.width * player.display_factor + 10)
                    M.toast({ html: "End of screen!" });
                return;
            }
            player.x += player.speed;
            player.frameY = 0;
            player.moving = true;
            handlePlayerFrame();
            then = Date.now();
        }
    }
}

function collision(player, object) {
    if (!(
        player.x > object.x + object.width ||
        player.x + player.width * player.display_factor < object.x ||
        player.y > object.y + object.height ||
        player.y + player.height * player.display_factor < object.y
    ))
        return true;
    else return false;
}

function collision_check() {
    if (collision(player, box1) || collision(player, box2)) {
        M.toast({
            html: "Player went out of road. Try again, keeping him on road",
        });
        reset_output();
    }
    if (collision(player, factory)) player_visit_history.push("factory");
    if (collision(player, home)) player_visit_history.push("home");
}

function evaluate_task() {
    if (
        player_visit_history[0] == "factory" &&
        player_visit_history[1] == "home" &&
        !carrot_available
    ) {
        // if (demoWorkspace.getAllBlocks(false).length > 3)
        //     M.toast({ html: "Task complete, good try! However we can do it more efficiently using not more than 3 blocks. Try again!" });
        // else { M.toast({ html: "Nice, Well Done!" }); }
        M.toast({ html: "Nice, Well Done!" });
        isStageCompleted = true;
    } else if (
        player_visit_history[0] == "factory" &&
        player_visit_history[1] == "home" &&
        carrot_available
    )
        M.toast({
            html: "Oops, Poor bunny has forgotten to eat the carrot! Instruct him to do so.",
        });
}
const sampleCode = "import bunny\nbunny.left(40)\nbunny.eatCarrot()\n";

function completedFlag() {
    return isStageCompleted;
}

const updateImports = ["bunny"]
function getNoOfBlocks() {
    const demoWorkspace = Blockly.getMainWorkspace();
    return demoWorkspace.getAllBlocks().length;
}
function runCode() {
    // if (tour_over) tour.complete();
    //handPointAt($("#hand"), $("#runbtn"), 'hidden');
    reset_output();
    window.LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var code = Blockly.JavaScript.workspaceToCode(demoWorkspace);
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
        eval(code);
        evaluate_task();
    } catch (e) { alert(e); }
}
export { right, left, eatCarrot, reset_output, completedFlag, sampleCode, runCode, updateImports, getNoOfBlocks };