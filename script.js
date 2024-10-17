function toggle_mode() {
    const toggleButton = document.getElementById('toggle-mode');
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        toggleButton.innerHTML = "<i class='material-icons'>dark_mode</i>"
    } else {
        toggleButton.innerHTML = "<i class='material-icons'>light_mode</i>"
    }
    play_se();
}

function play_se() {
    const sound_effect = document.getElementById('toggle-se').cloneNode();
    sound_effect.volume = 0.1;
    sound_effect.play();
}

function set_clock() {
    const hour_hand = document.querySelector('.hour-hand');
    const minute_hand = document.querySelector('.minute-hand');
    const second_hand = document.querySelector('.second-hand');

    const current_time = new Date();
    const seconds = current_time.getSeconds();
    const minutes = current_time.getMinutes();
    const hours = current_time.getHours();

    const seconds_deg = ((seconds / 60) * 360) + 270;
    const minutes_deg = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 270;
    const hours_deg = ((hours / 12) * 360) + ((minutes / 60) * 30) + 270;

    second_hand.style.transform = `rotate(${seconds_deg}deg)`;
    minute_hand.style.transform = `rotate(${minutes_deg}deg)`;
    hour_hand.style.transform = `rotate(${hours_deg}deg)`;
}

setInterval(set_clock, 1000);

set_clock();