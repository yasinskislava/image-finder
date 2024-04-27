import {
  alert,
  defaultModules,
} from "../node_modules/@pnotify/core/dist/PNotify.js";
import * as PNotifyMobile from "../node_modules/@pnotify/mobile/dist/PNotifyMobile.js";

defaultModules.set(PNotifyMobile, {});
import * as basicLightbox from "basiclightbox";

let check = true;
const gallery = document.querySelector(".gallery");
const searchbar = document.querySelector(".search-form");
const loadMore = document.getElementById("loadMore");
const search = document.getElementById("search-button");
let page = 1;

async function render(tags) {
  await fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${tags}&page=${page}&per_page=12&key=43085062-83502d00c5fb8aeb01fe37f91`
  )
    .then((value) => value.json())
    .then((value) => {
      if (value.hits.length) {
        
        loadMore.style.display = "block";
        if (value.hits.length < 12 || value.total === 12) {
          loadMore.style.display = "none";
        }
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
          console.log(cards.length);
          console.log((page - 1) * 12);
          console.log(cards.length - (12 - value.hits.length));
          for (let i = (page - 1) * 12; i < cards.length; i++) {
            console.log(i);
            cards[i].addEventListener("click", () => {
              const instance = basicLightbox.create(
                `<img src="${cards[i].firstElementChild.src}" width="800" height="600">`
              );
              instance.show();
            });
          }
        }, 1000);
      } else {
        loadMore.style.display = "none";
        alert({
          text: "No images found!",
        });
      }
    });
}
let features = "";
render(features);

search.addEventListener("click", () => {
  gallery.innerHTML = "";
  page = 1;
  features = searchbar.firstElementChild.value.split(" ").join("+");
  searchbar.firstElementChild.value = "";
  render(features);
});

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
