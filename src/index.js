import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const FILTER_PROPERTY = `?fields=name,
capital,
population,
flags,
languages
`;

const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInputHandle, DEBOUNCE_DELAY));

function onInputHandle(e) {
    clearMurkup();
    const inputValue = e.target.value;
    if (inputValue === '') {
        return
    };
    fetchCountries(inputValue);
};

function fetchCountries(name) {
    fetch(`https://restcountries.com/v3.1/name/${name}${FILTER_PROPERTY}`) 
    .then(responce => {
        if(!responce.ok){
            throw new Error(responce.status)
        }
        return responce.json()
    })
    .then(data => addMurkup(data)) 
    .catch(error => Notify.failure("Oops, there is no country with that name"))
};

function addMurkup(data) {
    if(data.length > 10) {
        return Notify.info("Too many matches found. Please enter a more specific name.")
    }
    createMurkup(data);
};

function createMurkup(data){
    if(data.length > 1) {
        return countryListMarkup(data)
    };
    countryInfoMurkup(data);
};

function countryListMarkup(data) {
    const countryListMarkup = data.map(country => 
        `<li class="country-list__item">
            <img src="${country.flags.svg}" alt="flag of ${country.name.official}" class="flags">
            <p><b>${country.name.official}</b></p>
        </li>`)
        .join('');
    countryListRef.insertAdjacentHTML('beforeend', countryListMarkup);
};

function countryInfoMurkup(data) {
    const countryInfoMurkup = data.map(country => 
        `<img src="${country.flags.svg}" alt="flag of ${country.name.official}" class="flag">
        <div class="country-info__text-content">
            <p><b>${country.name.official}</b></p>
            <ul class="country-info__list">
                <li><b>Capital: </b>${country.capital[0]}</li>
                <li><b>Population: </b>${country.population}</li>
                <li><b>Languages: </b>${Object.values(country.languages).join(', ')}</li>
            </ul>
        </div>`)
        .join('');
    countryInfoRef.insertAdjacentHTML('afterbegin', countryInfoMurkup);
};

function clearMurkup() {
    countryListRef.innerHTML = '';
    countryInfoRef.innerHTML = '';
};