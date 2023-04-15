import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const searchQuery = searchBox.value.trim();
  if (searchQuery === '') {
    clearMarkup();
    return;
  }

  fetchCountries(searchQuery)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length > 1 && data.length <= 10) {
        updateCountryList(data);
        return;
      }
      if (data.length === 1) {
        updateCountryInfo(data[0]);
        return;
      }
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function updateCountryList(countries) {
  clearMarkup();
  const markup = countries
    .map(country => {
      return `
			<li class="country-list--item">
            <img src="${country.flags.svg}" alt="Country flag" width="30", height="auto">
            <span class="country-list--name">${country.name.official}</span>
        </li>
				`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function updateCountryInfo(country) {
  clearMarkup();
  const markup = `
	<div class="country-info--item">
        <div class="country-card--header">
            <img src="${
              country.flags.svg
            }" alt="Country flag" width="55", height="35">
            <h2 class="country-card--name"> ${country.name.official}</h2>
        </div>
            <p class="country-card--field">Capital: <span class="country-value">${
              country.capital
            }</span></p>
            <p class="country-card--field">Population: <span class="country-value">${
              country.population
            }</span></p>
            <p class="country-card--field">Languages: <span class="country-value">${Object.values(
              country.languages
            ).join(',')}</span></p>
    </div>`;
  countryInfo.innerHTML = markup;
}

function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
