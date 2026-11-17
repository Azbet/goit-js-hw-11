import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector("#search-form");
console.log("Form elementi yakalandi mi?:", form);
const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");

let lightbox = new SimpleLightbox.default(".gallery a", {
  captionsData: "alt",
  captionDelay: 250,
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements.searchQuery.value.trim();

  if (!searchQuery) {
    iziToast.warning({
      title: "Warning",
      message: "Please enter a search query!",
      position: "topRight",
    });
    return;
  }

  gallery.innerHTML = "";

  loader.style.display = "grid";

  const API_KEY = "21500609-1dbb9b63fb14df1cafdda29de";
  const BASE_URL = "https://pixabay.com/api/";

  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
  });

  fetch(`${BASE_URL}?${searchParams}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.hits.length === 0) {
        iziToast.error({
          title: "Error",
          message:
            "Sorry, there are no images matching <br>your search query. Please try again!",
          position: "topRight",
        });
        return;
      }

      const markup = data.hits
        .map(
          (image) => `
        <li class="gallery-item">
          <a class="gallery-link" href="${image.largeImageURL}">
            <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              <span>${image.likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b>
              <span>${image.views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b>
              <span>${image.comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b>
              <span>${image.downloads}</span>
            </p>
          </div>
        </li>
      `,
        )
        .join("");

      gallery.insertAdjacentHTML("beforeend", markup);

      lightbox.refresh();
    })
    .catch((error) => {
      console.error("Hata detayi:", error);
      iziToast.error({
        title: "Error",
        message: "Something went wrong! Please try again later.",
        position: "topRight",
      });
    })
    .finally(() => {
      loader.style.display = "none";
    });
});
