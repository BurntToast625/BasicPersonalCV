let screen_width = window.innerWidth;
let screen_height = window.innerHeight;

let x = 0.5 * screen_width - 16;
let y = 0.7 * screen_height - 32;
let old_x = x;
let old_y = y;

// horizontal accel and velocity
let xa = 0.125; // X Acceleration
let min_xv = -8; // Min X Velocity
let max_xv = 8; // Max X Velocity
let xv = 0; // X Velocity

// vertical tweaks
let airborne = false;
let jp = -8; // Jump Power
let g = 0.2; // Gravity Power
let yv = 0; // Y Velocity 

// Platform
let on_p5 = false;
let pa = 0.05;
let p = 0;
let min_p = 0;
let max_p = 0.25 * screen_height;
let min_pv = -4;
let max_pv = 4;
let pv = 0;
let reversed = false;

const player = document.getElementById("player");
const p5 = document.getElementById("p5");
const profile_picture = document.getElementById("profile-picture");
const e = document.getElementById("e");
const arrows = document.getElementById("arrow");
const buttons = [document.getElementById("btn-whatsapp"), document.getElementById("btn-instagram"), document.getElementById("btn-github"), document.getElementById("btn-linkedin")]
let platform_pos = [{x: 0.2 * screen_width - 126, y: 0.3 * screen_height - 11, w: 252, h: 22}, {x: 0.8 * screen_width - 126, y: 0.3 * screen_height - 11, w: 252, h: 22}, {x: 0.2 * screen_width - 126, y: 0.55 * screen_height - 11, w: 252, h: 22}, {x: 0.8 * screen_width - 126, y: 0.55 * screen_height - 11, w: 252, h: 22}, {x: 0.5 * screen_width - 126, y: 0.3 * screen_height - 11 + p, w: 252, h: 22}];
let button_pos = [{x: 0.2 * screen_width - 126, y: 0.3 * screen_height - 71, w: 252, h: 62}, {x: 0.8 * screen_width - 126, y: 0.3 * screen_height - 71, w: 252, h: 62}, {x: 0.2 * screen_width - 126, y: 0.55 * screen_height - 71, w: 252, h: 62}, {x: 0.8 * screen_width - 126, y: 0.55 * screen_height - 71, w: 252, h: 62}];
let button_collision = [false, false, false, false];

// Keypresses detection
const keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// E
let ex = 0;
let ey = 0;
let e_triggered = false;
document.addEventListener("keydown", handleKeyPress);
document.addEventListener("keyup", (event) => {
    if (event.key === "e") {
        e_triggered = false;
    }
});

function activate_button() {
    for (let index = 0; index < button_collision.length; index++) {
        if (button_collision[index]) {
            buttons[index].click();
        }
    }
}

function handleKeyPress(event) {
    if (event.key === "e" && !e_triggered) {
        e_triggered = true;
        activate_button();
    }
}

function collision(b) {
    return (
        x + 32 > b.x &&
        x < b.x + b.w &&
        y + 32 > b.y &&
        y < b.y + b.h
    )
}

// Platform collision :sob:
function left_collision(b) {
    if (xv > 0 && old_x + 32 <= b.x && x + 32 >= b.x) { 
        x = b.x - 32;
        xv = 0;
        return true;
    }
    return false;
}

function right_collision(b) {
    if (xv < 0 && old_x >= b.x + b.w && x <= b.x + b.w) { 
        x = b.x + b.w;
        xv = 0;
        return true;
    }
    return false;
}

function top_collision(b) {
    if (yv > 0 && old_y + 32 <= b.y && y + 32 >= b.y) { 
        y = b.y - 32;
        yv = 0;
        airborne = false;
        return true;
    }
    return false;
}

function bottom_collision(b) {
    if (yv < 0 && old_y >= b.y + b.h && y <= b.y + b.h) { 
        y = b.y + b.h;
        yv = 0;
        return true;
    }
    return false;
}

function collision1(b) {
    if (collision(b)) return top_collision(b) || left_collision(b) || right_collision(b) || bottom_collision(b);
}

// For P5 :skull:
function check_p5_collision() {
    on_p5 = false;
    const platformBox = platform_pos[4];
    if (
        x + 32 > platformBox.x &&
        x < platformBox.x + platformBox.w &&
        y + 32 >= platformBox.y &&
        y + 32 <= platformBox.y + 22 &&
        yv >= 0
    ) {
        y = platformBox.y - 32;
        yv = 0;
        airborne = false;
        on_p5 = true;
    }
}

function check_collisions() {
    for (let platform of platform_pos) {            
        if (collision1(platform)) {
            return;
        }
    }
}

function update_platform_movement() {
    let old_p = p;

    if (reversed) {
        pv = Math.max(pv - pa, min_pv);
    } else {
        pv = Math.min(pv + pa, max_pv);
    }

    p += pv;

    if (p >= max_p) {
        p = max_p;
        reversed = true;
    } else if (p <= min_p) {
        p = min_p;
        reversed = false;
    }

    if (on_p5) y += p - old_p;
    platform_pos[4] = {x: 0.5 * screen_width - 126, y: 0.3 * screen_height - 11 + p, w: 252, h: 22};
}

function update_player_movement() {
    // Horizontal
    if (keys["ArrowRight"]) {
        if (!(xv + xa >= max_xv)) {
            if (xv < 0) xv += 2 * xa;
            else xv += xa;
        } else {
            xv = max_xv;
        }
    }
    if (keys["ArrowLeft"]) {
        if (!(xv - xa <= min_xv)) {
            if (xv > 0) xv -= 2 * xa;
            else xv -= xa;
        } else {
            xv = min_xv;
        }
    }
    if (!(keys["ArrowLeft"] || keys["ArrowRight"]) || (keys["ArrowLeft"] && keys["ArrowRight"])) {
        if (xv < 0) {
            xv = Math.min(0, xv + 2 * xa);
        } else if (xv > 0) {
            xv = Math.max(xv - 2 * xa, 0);
        }
    }

    // Vertical (I am so cooked)
    if (keys["ArrowUp"] && !airborne) {
        yv = jp;
        airborne = true;
    }
    if (airborne) {
        if (keys["ArrowDown"]) {
            yv += 2 * g;
        } else {
            yv += g;
        }
    }

    old_x = x;
    old_y = y;
    x += xv;
    y += yv;
    airborne = true;
    check_p5_collision();
    check_collisions();

    if (x < 0) x = 0, xv = 0;
    if (x + 32 > screen_width) x = screen_width - 32, xv = 0;
    if (y < 0) y = 0, yv = 0;
    if (y + 32 > 0.7 * screen_height) {
        y = 0.7 * screen_height - 32;
        airborne = false;
        yv = 0;
    }
}

function update_buttons() {
    for (let index = 0; index < button_pos.length; index++) {
        if (collision(button_pos[index])) {
            button_collision[index] = true;
        } else {
            button_collision[index] = false;
        }
    }

    for (let index = 0; index < button_collision.length; index++) {
        if (button_collision[index]) {
            e.style.display = `block`;
            ex = button_pos[index].x + 0.5 * button_pos[index].w - 15;
            ey = button_pos[index].y - 40;
            break;
        } else {
            e.style.display = `none`;
            ex = 0;
            ey = 0;
        }
    }
}
function loop() {
    update_player_movement();
    update_platform_movement();
    update_buttons();

    p5.style.transform = `translateY(${p}px)`;
    profile_picture.style.transform = `translateY(${p}px)`;
    player.style.transform = `translate(${x}px, ${y}px)`;
    e.style.transform = `translate(${ex}px, ${ey}px)`;
    requestAnimationFrame(loop);
}

function play_se() {
    const sound_effect = document.getElementById('toggle-se').cloneNode();
    sound_effect.volume = 0.1;
    sound_effect.play();
}

function hide_arrow() {
    arrows.style.display = `none`;
}

requestAnimationFrame(loop);
setInterval(hide_arrow, 7500);