import { catsData, catEmotions, catCategories } from "/data.js";

const emotionRadios = document.getElementById("emotion-radios");
const getImageBtn = document.getElementById("get-image-btn");
const gifsOnlyOption = document.getElementById("gifs-only-option");
const memeModalInner = document.getElementById("meme-modal-inner");
const memeModal = document.getElementById("meme-modal");
const memeModalCloseBtn = document.getElementById("meme-modal-close-btn");
const refreshBtn = document.getElementById("refresh");
emotionRadios.addEventListener("change", highlightCheckedOption);

memeModalCloseBtn.addEventListener("click", closeModal);
document.addEventListener("click", closeModal);

getImageBtn.addEventListener("click", renderCat);
refreshBtn.addEventListener("click", renderCat);

let fetchedCatsArray = [];

async function fetchRandomCat(emotion) {
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${emotion}+cat&per_page=20&page=1`, {
    method: "GET",
    headers: {
      Authorization: `Client-ID ${process.env.VITE_MY_VAR}`,
      // Authorization: `Client-ID ${import.meta.env.VITE_MY_VAR}`,
    },
  });
  const data = await res.json();
  // console.log(data);

  fetchedCatsArray = data;
  return data.results;
}

function highlightCheckedOption(e) {
  const radios = document.getElementsByClassName("radio");
  for (let radio of radios) {
    radio.classList.remove("highlight");
  }
  document.getElementById(e.target.id).parentElement.classList.add("highlight");
}

function closeModal(event) {
  // console.log(event.target.matches(".meme-modal-close-btn"));
  if (event.target.matches(".meme-modal-close-btn")) memeModal.style.display = "none";
}

async function renderCat() {
  // const cat = await fetchRandomCat();
  const catObject = await getSingleCatObject();

  // console.log(catObject);
  memeModalInner.innerHTML = `
        <img
        class="cat-img"
        src="${catObject.urls.small}"
        alt="cat"
        >
        `;
  memeModal.style.display = "flex";
}

function fetchRandomCatFromData(cats) {
  return cats[Math.floor(Math.random() * cats.length)];
}
async function getSingleCatObject() {
  let catObj = null;
  if (fetchedCatsArray.length !== 0) {
    catObj = fetchRandomCatFromData(fetchedCatsArray);
  } else {
    const catEmotion = getMatchingCatsArray();
    const res = await fetchRandomCat(catEmotion);
    fetchedCatsArray = res;
    catObj = fetchRandomCatFromData(fetchedCatsArray);
  }

  // console.log("inside of getsingle cat", catObj);

  // const catObj = fetchRandomCat();
  // console.log("cat oobject", catObj);
  return catObj;

  // if (catsArray.length === 1) {
  //   return catsArray[0];
  // } else {
  //   const randomNumber = Math.floor(Math.random() * catsArray.length);
  //   return catsArray[randomNumber];
  // }
}

function getMatchingCatsArray() {
  if (document.querySelector('input[type="radio"]:checked')) {
    const selectedEmotion = document.querySelector('input[type="radio"]:checked').value;
    // const isGif = gifsOnlyOion.checked;

    // const matchingCatsArray = catsData.filter(function (cat) {
    //   if (isGif) {
    //     return cat.emotionTags.includes(selectedEmotion) && cat.isGif;
    //   } else {
    //     return cat.emotionTags.includes(selectedEmotion);
    //   }
    // });
    return selectedEmotion;
  }
}

// function getEmotionsArray(cats) {
//   const emotionsArray = [];
//   for (let cat of cats) {
//     for (let emotion of cat.emotionTags) {
//       if (!emotionsArray.includes(emotion)) {
//         emotionsArray.push(emotion);
//       }
//     }
//   }
//   return emotionsArray;
// }

function getRandomEmotions() {
  const catEmotionsArray = [];

  for (let i = 0; i < 10; i++) {
    catEmotionsArray.push(catEmotions[Math.floor(Math.random() * catEmotions.length)]);
  }
  return catEmotionsArray;
}

function renderEmotionsRadios() {
  // getRandomEmotions(catEmotions);

  let radioItems = ``;
  const emotions = catCategories;
  for (let emotion of emotions) {
    radioItems += `
        <div class="radio">
            <label for="${emotion}">${emotion}</label>
            <input
            type="radio"
            id="${emotion}"
            value="${emotion}"
            name="emotions"
            >
        </div>`;
  }
  emotionRadios.innerHTML = radioItems;
}

renderEmotionsRadios(catEmotions);
