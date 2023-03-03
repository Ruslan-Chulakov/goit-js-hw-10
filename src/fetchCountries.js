const URL = `https://restcountries.com/v3.1/name/`
const FILTER_PROPERTY = `?fields=name,
capital,
population,
flags,
languages
`;

function fetchCountries(name) {
    return fetch(`${URL}${name}${FILTER_PROPERTY}`) 
    .then(responce => {
        if(!responce.ok) {
            throw new Error(responce.status);
        };
        return responce.json()
    });
};

export {fetchCountries};

