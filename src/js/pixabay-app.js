import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '39941654-5d072207aeb6fc27e32db6fb7';

  constructor(perPage) {
    this.page = 1;
    this.perPage = perPage;
    this.q = null;
  }
  getPhotos() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.q,
        page: this.page,
        per_page: this.perPage,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
  }
}
