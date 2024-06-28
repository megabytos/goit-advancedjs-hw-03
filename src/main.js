import { fetchBreeds, fetchCatByBreed } from './cat-api';
import slimSelect from 'slim-select';
import 'slim-select/styles';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  select: document.querySelector('.breed-select'),
  container: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};
const showElement = elm => refs[elm].classList.remove('visually-hidden');
const hideElement = elm => refs[elm].classList.add('visually-hidden');

const showBreedsList = _ => {
  showElement('loader');
  hideElement('select');
  fetchBreeds()
    .then(({ data }) => {
      const breeds = data.map(({ id, name }) => ({ text: name, value: id }));
      new slimSelect({
        select: '.breed-select',
        placeholder: 'Select a breed',
        searchPlaceholder: 'Search a breed',
        data: breeds,
        events: {
          afterChange: selected => showBreed(selected[0].value),
        },
      });
      showElement('select');
    })
    .catch(error => {
      iziToast.error({ title: 'Error', message: error.message, position: 'center' });
    })
    .finally(() => {
      hideElement('loader');
    });

  const showBreed = breedId => {
    hideElement('container');
    showElement('loader');
    fetchCatByBreed(breedId)
      .then(response => {        
        if (!response.data) {
          throw new Error('Empty response');
        }
        if (!response.data[0].breeds) {
          throw new Error('Empty breeds data');
        }
        if (!response.data[0].breeds.length) {
          throw new Error('Breed not found');
        }
        const data = response.data[0].breeds[0];
        if (response.data[0].url) data.url = response.data[0].url;
        drawBreedInfo(data);
      })
      .catch(error => {
        iziToast.error({ title: 'Error', message: error.message, position: 'center' });
      })
      .finally(() => {
        hideElement('loader');
      });
  };
};

const drawBreedInfo = data => {
  refs.container.innerHTML = `
      <img src="${data.url}" alt="${data.name}" />
      <div>
        <h2 class="title">${data.name}</h2>
        <p class="description">${data.description}</p>
        <p><strong>Temperament:</strong> ${data.temperament}</p>
      </div>
    `;
  showElement('container');
};

showBreedsList();