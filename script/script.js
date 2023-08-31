document.addEventListener('DOMContentLoaded', function () {
  const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bmt3c3Bscm5hc2Z5eHV0YXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMwNTU2NjEsImV4cCI6MjAwODYzMTY2MX0.m8SbumGRrHqY0L-DJ0FiMzlfrvdogBe32L-hgJM_NHo";
  const headers = new Headers();
  headers.append("apikey", apiKey);

  const BASE_URL = 'https://htnkwsplrnasfyxutazx.supabase.co/rest/v1';


  // Создаем элемент canvas и добавляем его в контейнер
  const canvasContainer = document.getElementById('canvas-container');
  const canvas = document.createElement('canvas');
  canvas.id = 'image-canvas';
  canvasContainer.appendChild(canvas);

  // Переменные для работы с контекстом canvas
  const ctx = canvas.getContext('2d');

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
  // Функция для проверки наличия изображения в контейнере
  function hasImageInContainer(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      return container.querySelector('canvas') !== null;
    }
    return false;
  }

  const refreshShortQuotesButton = document.getElementById("refresh-short-quotes");
  refreshShortQuotesButton.addEventListener("click", () => {
    if (hasImageInContainer('image-container')) {
      const imageUrl = localStorage.getItem('selectedImage');
      // const quoteText = "Ваш текст цитаты здесь"; 
      addQuoteToCanvas(imageUrl, currentQuote);
      fetchAndDisplayQuotes("motivation", "short", "short");
    } else {
      fetchAndDisplayQuotes("motivation", "short", "short");
    }
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
  const imageContainer = document.getElementById('canvas-container');

  function fetchRandomImage(query, collections, orientation, size) {
    fetch(`${endpoint}?query=${query}&collections=${collections}&orientation=${orientation}&fit=clip&w=${size}&h=${size}`, {
      method: 'GET',
      headers: {
        Authorization: `Client-ID ${accessKey}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response data:', data);

        const imageUrl = data.urls.regular;
        addQuoteToCanvas(imageUrl, currentQuote);
        localStorage.setItem('selectedImage', imageUrl);



        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;

        imageContainer.innerHTML = '';
        imageContainer.appendChild(imgElement);

        // localStorage.setItem('selectedImage', imageUrl);

        displaySavedImage();
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



  // ====
  function addQuoteToCanvas(imageUrl, quoteText) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const savedImage = localStorage.getItem('selectedImage');
    let img = new Image(); // Объявляем переменную img здесь

    if (savedImage) {
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(quoteText, 10, canvas.height - 30);

        // Очищаем и добавляем canvas в контейнер
        const canvasContainer = document.getElementById('canvas-container');
        canvasContainer.innerHTML = '';
        canvasContainer.appendChild(canvas);

        // Сохраняем URL изображения в localStorage
        localStorage.setItem('selectedImage', imageUrl);
      };
    }
    img.src = savedImage; // Теперь переменная img доступна за пределами блока условия
  }


  const useQuoteButtons = document.querySelectorAll('.current-quote');
  let currentQuote = "";

  // Получаем сохраненную фотографию и цитату
  const savedImage = localStorage.getItem('selectedImage');
  const savedQuote = localStorage.getItem('selectedQuote');

  // Если есть сохраненная фотография и цитата, отображаем их на canvas
  if (savedImage && savedQuote) {
    addQuoteToCanvas(savedImage, savedQuote);
  }

  useQuoteButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const quoteContainers = document.querySelectorAll('.quote-container');

      if (index < quoteContainers.length) {
        const quoteContainer = quoteContainers[index];
        const quote = quoteContainer.querySelector('p').textContent;

        if (hasImageInContainer('canvas-container')) {
          const imageUrl = localStorage.getItem('selectedImage');

          // Убираем кавычки из начала и конца цитаты
          const cleanedQuote = quote.replace(/^"|"$/g, '');

          addQuoteToCanvas(imageUrl, cleanedQuote);
          button.setAttribute('data-quote', quote);
          currentQuote = cleanedQuote;

          // Сохраняем выбранную цитату в локальное хранилище
          localStorage.setItem('selectedQuote', currentQuote);

          console.log('Сохраненная цитата:', currentQuote);
        }
      }
    });
  });


});
