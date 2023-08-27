const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bmt3c3Bscm5hc2Z5eHV0YXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMwNTU2NjEsImV4cCI6MjAwODYzMTY2MX0.m8SbumGRrHqY0L-DJ0FiMzlfrvdogBe32L-hgJM_NHo";
const headers = new Headers();
headers.append("apikey", apiKey);

const BASE_URL = 'https://htnkwsplrnasfyxutazx.supabase.co/rest/v1';


const canvas = document.getElementById("image-canvas");
const ctx = canvas.getContext("2d");

let global_data = {
  motivation: {
    long: [],
    short: []
  },
  love: {
    long: [],
    short: []
  },
};

async function fetchData(category, quoteType) {
  try {
    const response = await fetch(`${BASE_URL}/quotes?category=eq.${category}&long_quote=eq.${quoteType}`, { headers });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    global_data[category][quoteType] = data; // Сохраняем данные в global_data под соответствующими ключами
  } catch (error) {
    console.error('Error:', error);
  }
}
async function fetchAndDisplayQuotes(category, quoteType, containerId) {
  try {
    if (!global_data[category][quoteType].length) {
      await fetchData(category, quoteType); // Если данные для этой категории и типа цитат еще не загружены, загружаем их
    }

    const data = global_data[category][quoteType];

    const container = document.getElementById(containerId);
    container.innerHTML = "";

    let index = Math.floor(Math.random() * data.length);
    const quoteElement = document.createElement("div");
    quoteElement.classList.add("quote");
    quoteElement.innerHTML = `<p>"${data[index].quote_text}"</p>`;
    container.appendChild(quoteElement);
  } catch (error) {
    console.error('Error:', error);
  }
}

console.log(global_data);

// Добавление обработчиков кнопок для обновления цитат
const refreshShortQuotesButton = document.getElementById("refresh-short-quotes");
refreshShortQuotesButton.addEventListener("click", () => {
  fetchAndDisplayQuotes("motivation", "short", "short");
});

const refreshLongQuotesButton = document.getElementById("refresh-long-quotes");
refreshLongQuotesButton.addEventListener("click", () => {
  fetchAndDisplayQuotes("motivation", "long", "long");
});

const refreshLoveShortQuotesButton = document.getElementById("refresh-love-short-quotes");
refreshLoveShortQuotesButton.addEventListener("click", () => {
  fetchAndDisplayQuotes("love", "short", "love-short");
});

const refreshLoveLongQuotesButton = document.getElementById("refresh-love-long-quotes");
refreshLoveLongQuotesButton.addEventListener("click", () => {
  fetchAndDisplayQuotes("love", "long", "love-long");
});

// Инициализация: загрузка цитат при загрузке страницы
fetchAndDisplayQuotes("motivation", "short", "short");
fetchAndDisplayQuotes("motivation", "long", "long");
fetchAndDisplayQuotes("love", "short", "love-short");
fetchAndDisplayQuotes("love", "long", "love-long");

// фото  API 

const accessKey = 'dfN4bFrAAlW5zZtS3d03Y1ycn0XzfERHewdopG9nZm8';
const endpoint = 'https://api.unsplash.com/photos/random';
const imageContainer = document.getElementById('image-container');

function fetchRandomImage(query, collections, orientation, size) {
  fetch(`${endpoint}?query=${query}&collections=${collections}&orientation=${orientation}&fit=clip&w=${size}&h=${size}`, {
    method: 'GET',
    headers: {
      Authorization: `Client-ID ${accessKey}`
    }
  })
    .then(response => response.json())
    .then(data => {
      const imageUrl = data.urls.regular;

      // Создаем элемент img и устанавливаем ему URL
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;

      // Очищаем контейнер и добавляем новый элемент
      imageContainer.innerHTML = '';
      imageContainer.appendChild(imgElement);

      // Сохранение URL фотографии в локальное хранилище
      localStorage.setItem('selectedImage', imageUrl);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}



document.getElementById('motivation-horizontal-small').addEventListener('click', () => {
  fetchRandomImage('motivation', '825815', 'landscape', 300);
});

document.getElementById('motivation-horizontal-large').addEventListener('click', () => {
  fetchRandomImage('motivation', '825815', 'landscape', 1200);
});

document.getElementById('motivation-vertical-small').addEventListener('click', () => {
  fetchRandomImage('motivation', '825815', 'portrait', 300);
});

document.getElementById('motivation-vertical-large').addEventListener('click', () => {
  fetchRandomImage('motivation', '825815', 'portrait', 1200);
});

document.getElementById('love-horizontal-small').addEventListener('click', () => {
  fetchRandomImage('love', '208403', 'landscape', 300);
});

document.getElementById('love-horizontal-large').addEventListener('click', () => {
  fetchRandomImage('love', '208403', 'landscape', 1200);
});

document.getElementById('love-vertical-small').addEventListener('click', () => {
  fetchRandomImage('love', '208403', 'portrait', 300);
});

document.getElementById('love-vertical-large').addEventListener('click', () => {
  fetchRandomImage('love', '208403', 'portrait', 1200);
});


function displaySavedImage() {
  const selectedImage = localStorage.getItem('selectedImage');
  if (selectedImage) {
    const imgElement = document.createElement('img');
    imgElement.src = selectedImage;
    imageContainer.innerHTML = '';
    imageContainer.appendChild(imgElement);
  }
}

// При загрузке страницы отобразить сохраненную фотографию (если есть)
displaySavedImage();

// ====


// Функция для отображения цитаты на фотографии
// Функция для отображения цитаты на фотографии
function displayQuoteOnImage(quote) {
  const img = new Image();
  img.src = canvas.toDataURL();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";

    ctx.fillText(quote, canvas.width / 2, canvas.height / 2);
  };
}

// Обновление цитаты и ее отображение на фотографии
function updateAndDisplayQuote(category, quoteType, containerId) {
  if (
    global_data[category] &&
    global_data[category][quoteType] &&
    global_data[category][quoteType].length > 0
  ) {
    const container = document.getElementById(containerId);
    const quoteIndex = Math.floor(Math.random() * global_data[category][quoteType].length);

    if (global_data[category][quoteType][quoteIndex]) {
      const quoteText = global_data[category][quoteType][quoteIndex].quote_text;
      const existingQuoteElement = document.getElementById("quote-text");
      if (existingQuoteElement) {
        existingQuoteElement.innerHTML = `"${quoteText}"`;
      } else {
        const newQuoteElement = document.createElement("div");
        newQuoteElement.id = "quote-text";
        newQuoteElement.classList.add("quote");
        newQuoteElement.innerHTML = `"${quoteText}"`;
        container.appendChild(newQuoteElement);
      }
      displayQuoteOnImage(quoteText);
    }
  }
}

// Обработчики кнопок для обновления цитат и их отображения на фотографии
refreshShortQuotesButton.addEventListener("click", () => {
  updateAndDisplayQuote("motivation", "short", "short");
});

refreshLongQuotesButton.addEventListener("click", () => {
  updateAndDisplayQuote("motivation", "long", "long");
});

refreshLoveShortQuotesButton.addEventListener("click", () => {
  updateAndDisplayQuote("love", "short", "love-short");
});

refreshLoveLongQuotesButton.addEventListener("click", () => {
  updateAndDisplayQuote("love", "long", "love-long");
});

// Инициализация: загрузка цитат и их отображение на фотографии при загрузке страницы
updateAndDisplayQuote("motivation", "short", "short");
updateAndDisplayQuote("motivation", "long", "long");
updateAndDisplayQuote("love", "short", "love-short");
updateAndDisplayQuote("love", "long", "love-long");

// Инициализация: отображение начальной фотографии
const initialImage = new Image();
initialImage.src = "URL_TO_INITIAL_IMAGE"; // Замените на URL начальной фотографии

initialImage.onload = () => {
  canvas.width = initialImage.width;
  canvas.height = initialImage.height;
  ctx.drawImage(initialImage, 0, 0);
};