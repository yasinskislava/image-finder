const gallery = document.querySelector(".gallery");
const searchbar = document.querySelector(".search-form");
const loadMore = document.getElementById("loadMore");
let page = 1;

import * as basicLightbox from "basiclightbox";

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

async function render(tags) {
  await fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${tags}&page=${page}&per_page=12&key=43085062-83502d00c5fb8aeb01fe37f91`
  )
    .then((value) => value.json())
    .then((value) => {
      for (let i of value.hits) {
        gallery.insertAdjacentHTML(
          "beforeend",
          `
        <li class="photo-card">
          <img src="${i.webformatURL}" alt="${i.tags}" />

          <div class="stats">
            <p class="stats-item">
              <i class="material-icons">thumb_up</i>
              ${i.likes}
            </p>
            <p class="stats-item">
              <i class="material-icons">visibility</i>
              ${i.views}
            </p>
            <p class="stats-item">
              <i class="material-icons">comment</i>
              ${i.comments}
            </p>
            <p class="stats-item">
              <i class="material-icons">cloud_download</i>
              ${i.downloads}
            </p>
          </div>
        </li>`
        );
      }
      setTimeout(() => {
        const cards = document.querySelectorAll(".photo-card");
        for (let i of cards) {
          i.addEventListener("click", () => {
            const instance = basicLightbox.create(`<img src="${i.firstElementChild.src}" width="800" height="600">`);
            instance.show();
          });
        }
      }, 1000);
    });
}
let features = "";
render(features);
page++;

searchbar.firstElementChild.addEventListener(
  "input",
  debounce(() => {
    gallery.innerHTML = "";
    page = 1;
    features = searchbar.firstElementChild.value.split(" ").join("+");
    render(features);
  }, 700)
);

loadMore.addEventListener("click", async () => {
  page++;
  render(features);
  setTimeout(() => {
    gallery.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, 800);
});


// Нескінчене завантаження
// const intersectionObserver = new IntersectionObserver((entries) => {
//   if (entries[0].intersectionRatio <= 0) return;
//   page++;
//   render(features);
// });
// intersectionObserver.observe(loadMore);
