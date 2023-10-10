import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayAPI } from './pixabay-app.js';
import { createMarkUp } from './createmarkup.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.js-searh-form'),
  searchBtn: document.querySelector('.search-btn'),
  list: document.querySelector('.gallery'),
  anchor: document.querySelector('.target-element'),
};

const { form, searchBtn, list, input, anchor } = refs;

const observer = new IntersectionObserver(
  (entries, observer) => {
    if (entries[0].isIntersecting) {
      loadMoreData();
    }
  },
  {
    root: null,
    rootMargin: '300px',
    threshold: 1,
  }
);

const pixabayAPI = new PixabayAPI(40);

form.addEventListener('submit', handleSubmit);
async function handleSubmit(event) {
  event.preventDefault();
  pixabayAPI.page = 1;
  const searchQuery = event.target.elements['searchQuery'].value.trim();
  pixabayAPI.q = searchQuery;
  if (!searchQuery) {
    list.innerHTML = '';
    return alert('your query is empty');
  }

  try {
    const response = await pixabayAPI.getPhotos();
    console.log(` we find ${Math.ceil(response.data.total / 40)} page`);
    list.innerHTML = createMarkUp(response.data.hits);
    if (response.data.hits.length === 0) {
      list.innerHTML = '';
      observe.unobserve(anchor);
    }
    if (response.data.total > pixabayAPI.perPage) {
      observer.observe(anchor);
    }
  } catch (error) {
    console.log(error);
  }
}
async function loadMoreData() {
  try {
    if (pixabayAPI.page > 1) {
      const response = await pixabayAPI.getPhotos();
      list.insertAdjacentHTML('beforeend', createMarkUp(response.data.hits));

      console.log();
      if (Math.ceil(response.data.total / 40) === pixabayAPI.page) {
        observer.unobserve(anchor);
        return alert('the end');
      }
    }

    pixabayAPI.page += 1;
  } catch (error) {
    console.log(error);
  }
}

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
