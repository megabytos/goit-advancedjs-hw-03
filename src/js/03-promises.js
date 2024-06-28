import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.querySelector('.form').addEventListener('submit', createPromices);

function createPromices(e) {
  e.preventDefault();
  const delay = Number(e.currentTarget.elements.delay.value);
  const step = Number(e.currentTarget.elements.step.value);
  const amount = Number(e.currentTarget.elements.amount.value);

  for (let position = 1; position <= amount; position++) {
    const currentDelay = delay + position * step;
    createPromise(position, currentDelay)
      .then(({ position, delay }) => {
        iziToast.success({
          message: `✅ Fulfilled promise ${position} in ${delay}ms`,
          position: 'topRight',
        });
      })
      .catch(({ position, delay }) => {
        iziToast.error({
          message: `❌ Rejected promise ${position} in ${delay}ms`,
          position: 'topRight',
        });
      });
  }
  e.currentTarget.reset();
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
