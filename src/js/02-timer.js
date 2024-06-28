import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('button[data-start]');
const dateTimePicker = document.getElementById('datetime-picker');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');
startBtn.disabled = true;
let timerId = null;
let selectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose,
  onChange,
  onOpen,
};

flatpickr(dateTimePicker, options);

startBtn.addEventListener('click', runTimer);

function onChange(selectedDates) {
  if (timerId) {
    clearInterval(timerId);
    drawTimer(0);
  }
}

function onOpen() {
  startBtn.disabled = true;
}

function onClose(selectedDates) {
  selectedDate = selectedDates[0];
  if (selectedDates[0] > new Date()) {
    startBtn.disabled = false;
  } else {
    startBtn.disabled = true;
    drawTimer(0);
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
  }
}

function runTimer() {
  startBtn.disabled = true;
  dateTimePicker.disabled = true;
  const endDate = selectedDate;
  if (timerId) {
    clearInterval(timerId);
  }
  timerId = setInterval(() => {
    const timeRemaining = endDate - Date.now();
    if (timeRemaining <= 0) {
      clearInterval(timerId);
      drawTimer(0);
      dateTimePicker.disabled = false;
      startBtn.disabled = true;
      return;
    }
    drawTimer(timeRemaining);
  }, 1000);
}

function drawTimer(timeMs) {
  const { days, hours, minutes, seconds } = convertMs(timeMs);
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}
