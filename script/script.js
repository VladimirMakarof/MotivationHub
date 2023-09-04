let imageUrl;
let currentQuote = "";

document.addEventListener('DOMContentLoaded', function () {
  try {
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bmt3c3Bscm5hc2Z5eHV0YXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMwNTU2NjEsImV4cCI6MjAwODYzMTY2MX0.m8SbumGRrHqY0L-DJ0FiMzlfrvdogBe32L-hgJM_NHo";
    const headers = new Headers();
    headers.append("apikey", apiKey);

    const BASE_URL = 'https://htnkwsplrnasfyxutazx.supabase.co/rest/v1';


    const fontColorInput = document.getElementById("font-color-input");
    const fontSizeInput = document.getElementById("font-size-input");

    // Устанавливаем начальные значения для fontSize и fontColor
    const savedFontSize = localStorage.getItem('fontSize');
    const savedFontColor = localStorage.getItem('fontColor');
    const fontSize = savedFontSize || '36px';
    const fontColor = savedFontColor || '#004543';

    // Устанавливаем начальные значения для инпутов
    fontSizeInput.value = fontSize;
    fontColorInput.value = fontColor;

    // Проверяем, есть ли сохраненные значения в localStorage
    const savedImage = localStorage.getItem('selectedImage');
    const savedQuote = localStorage.getItem('selectedQuote');

    if (savedImage) {
      currentQuote = savedQuote;
      addQuoteToCanvas(savedImage, currentQuote, fontColor, fontSize);
    } else {
      fetchRandomImage('motivation', '825815', 'landscape', 300);
    }



    // Создаем элемент canvas и добавляем его в контейнер
    const canvasContainer = document.getElementById('canvas-container');
    const canvas = document.createElement('canvas');
    canvas.id = 'image-canvas';
    canvasContainer.appendChild(canvas);

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
          await fetchData(category, quoteType);
        }

        const data = global_data[category][quoteType];

        const container = document.getElementById(containerId);
        container.innerHTML = "";

        let index = Math.floor(Math.random() * data.length);
        const quoteElement = document.createElement("div");
        quoteElement.classList.add("quote");
        quoteElement.innerHTML = `<p>"${data[index].quote_text}"</p>`;
        container.appendChild(quoteElement);

        updateFontSettings();
      } catch (error) {
        console.error('Error:', error);
      }
    }

    console.log(global_data);


    function hasImageInContainer(id) {
      const container = document.getElementById(id);
      return container?.querySelector('canvas') !== null;
    }

    const refreshShortQuotesButton = document.getElementById("refresh-short-quotes");
    refreshShortQuotesButton.addEventListener("click", () => {
      fetchAndDisplayQuotes("motivation", "short", "short");
      updateFontSettings();
    });

    const refreshLongQuotesButton = document.getElementById("refresh-long-quotes");
    refreshLongQuotesButton.addEventListener("click", () => {
      fetchAndDisplayQuotes("motivation", "long", "long");
      updateFontSettings();
    });

    const refreshLoveShortQuotesButton = document.getElementById("refresh-love-short-quotes");
    refreshLoveShortQuotesButton.addEventListener("click", () => {
      fetchAndDisplayQuotes("love", "short", "love-short");
      updateFontSettings();
    });

    const refreshLoveLongQuotesButton = document.getElementById("refresh-love-long-quotes");
    refreshLoveLongQuotesButton.addEventListener("click", () => {
      fetchAndDisplayQuotes("love", "long", "love-long");
      updateFontSettings();
    });

    // Функция для обновления размера и цвета шрифта
    function updateFontSettings() {
      const fontColor = localStorage.getItem("fontColor") || "#004543"; // Здесь устанавливаем цвет шрифта
      const fontSize = localStorage.getItem('fontSize') || '40px Arial'; // Здесь устанавливаем размер шрифта
      const savedImage = localStorage.getItem('selectedImage');
      const quoteText = localStorage.getItem('selectedQuote');
      const selectedFont = localStorage.getItem("selectedFont") || "'Arial', sans-serif"; // Здесь устанавливаем выбранный шрифт

      if (savedImage && quoteText && fontColor && fontSize) {
        addQuoteToCanvas(savedImage, quoteText, fontColor, fontSize, selectedFont);
      }
    }



    // Инициализация: загрузка цитат при загрузке страницы
    fetchAndDisplayQuotes("motivation", "short", "short");
    fetchAndDisplayQuotes("motivation", "long", "long");
    fetchAndDisplayQuotes("love", "short", "love-short");
    fetchAndDisplayQuotes("love", "long", "love-long");



    window.addEventListener('storage', (event) => {
      // Если изменения произошли в localStorage, обновите значения цвета и размера шрифта
      if (event.key === 'fontColor' || event.key === 'fontSize') {
        updateFontSettings();
      }
    });

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

          imageUrl = data.urls.regular; // Обновляем глобальную переменную imageUrl
          localStorage.setItem('selectedImage', imageUrl); // Сохраняем imageUrl в localStorage

          // Получаем сохраненные значения из localStorage
          const fontColor = localStorage.getItem('fontColor') || '#004543'; // Здесь устанавливаем цвет шрифта
          const fontSize = localStorage.getItem('fontSize') || '40px Arial'; // Здесь устанавливаем размер шрифта

          addQuoteToCanvas(imageUrl, currentQuote, fontColor, fontSize);
          let quoteText = localStorage.getItem('selectedQuote');
          addQuoteToCanvas(imageUrl, quoteText, fontColor, fontSize);
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

    // ====
    function addQuoteToCanvas(imageUrl, quoteText, fontColor, fontSize, selectedFont) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const savedImage = localStorage.getItem('selectedImage');

      let img = new Image();

      if (savedImage) {
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Получаем шрифт, цвет и размер из аргументов функции
          ctx.fillStyle = fontColor;
          ctx.font = `${fontSize}px ${selectedFont}`;

          // Функция для переноса текста на новую строку, если не умещается
          function wrapText(text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            let line = '';

            for (let i = 0; i < words.length; i++) {
              const testLine = line + words[i] + ' ';
              const testWidth = ctx.measureText(testLine).width;
              if (testWidth > maxWidth && i > 0) {
                ctx.fillText(line, x, y);
                line = words[i] + ' ';
                y += lineHeight;
              } else {
                line = testLine;
              }
            }
            ctx.fillText(line, x, y);
          }

          // Начальные координаты для текста
          const x = 10;
          const y = canvas.height - 200;
          const maxWidth = canvas.width - 20; // Учитываем отступы слева и справа
          const lineHeight = fontSize * 1.2; // Высота строки

          wrapText(quoteText, x, y, maxWidth, lineHeight);

          const canvasContainer = document.getElementById('canvas-container');
          canvasContainer.innerHTML = '';
          canvasContainer.appendChild(canvas);

          localStorage.setItem('selectedImage', imageUrl);
        };
      }
      img.src = savedImage;
    }






    fontSizeInput.addEventListener('input', () => {
      const fontColor = localStorage.getItem('fontColor') || '#004543';
      const fontSize = fontSizeInput.value + 'px';
      addQuoteToCanvas(imageUrl, currentQuote, fontColor, fontSize);

      // Получаем сохраненные значения из localStorage
      const savedImage = localStorage.getItem('selectedImage');
      const savedQuote = localStorage.getItem('selectedQuote');

      if (savedImage) {
        imageUrl = savedImage; // Обновляем глобальную переменную imageUrl только если она сохранена в localStorage
      }

      localStorage.setItem('fontSize', fontSize); // Сохраняем значение fontSize в localStorage
      localStorage.setItem('fontColor', fontColor); // Сохраняем значение fontColor в localStorage
      // localStorage.setItem('fontFamily', 'Arial');

      // Обновляем переменные fontColor и fontSize
      addQuoteToCanvas(imageUrl, currentQuote, fontColor, fontSize);
    });


    fontColorInput.addEventListener('input', () => {
      const fontColor = fontColorInput.value; // Сохраняем только цвет шрифта
      const fontSize = localStorage.getItem('fontSize') || '40px Arial'; // Получаем сохраненный размер шрифта

      // Обновляем значение fontSize в localStorage
      localStorage.setItem('fontSize', fontSize);
      // Обновляем значение fontColor в localStorage
      localStorage.setItem('fontColor', fontColor);

      addQuoteToCanvas(imageUrl, currentQuote, fontColor, fontSize);
    });

    // ++++++

    const fontFamilySelector = document.getElementById("font-family-selector");

    // Добавляем обработчики событий для сохранения и применения значений
    fontSizeInput.addEventListener("change", () => {
      const fontSize = fontSizeInput.value;
      localStorage.setItem("fontSize", fontSize); // Сохраняем выбранный размер шрифта
      updateFontSettings(); // Обновляем шрифт на странице
    });

    fontFamilySelector.addEventListener("change", () => {
      const selectedFont = fontFamilySelector.value; // Получаем выбранный шрифт
      const fontColor = localStorage.getItem('fontColor') || '#004543'; // Получаем сохраненный цвет шрифта
      const fontSize = localStorage.getItem('fontSize') || '40px Arial'; // Получаем сохраненный размер шрифта

      // Обновляем значение выбранного шрифта в localStorage
      localStorage.setItem("selectedFont", selectedFont);

      // Обновляем шрифт на canvas
      addQuoteToCanvas(imageUrl, currentQuote, fontColor, fontSize, selectedFont);
    });


    // ++++


    const useQuoteButtons = document.querySelectorAll('.current-quote');


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


    // Устанавливаем начальные значения для инпутов
    fontSizeInput.value = parseInt(fontSize, 20); // Преобразуем строку в число
    fontColorInput.value = fontColor;

    // Если есть сохраненная фотография, отображаем ее на canvas
    if (savedImage) {
      currentQuote = savedQuote; // Обновляем currentQuote
      addQuoteToCanvas(savedImage, currentQuote, fontColor, fontSize);
    } else {
      // Если нет сохраненной фотографии, загружаем случайную фотографию
      fetchRandomImage('motivation', '825815', 'landscape', 300);
    }

    // сохраняем фото
    const saveButton = document.getElementById("save-button");

    saveButton.addEventListener("click", () => {
      const savedImage = localStorage.getItem('selectedImage');
      const savedQuote = localStorage.getItem('selectedQuote');
      const savedFontColor = localStorage.getItem('fontColor');
      const savedFontSize = localStorage.getItem('fontSize');
      const selectedFont = localStorage.getItem("selectedFont") || "'Arial', sans-serif";

      if (savedImage && savedQuote && savedFontColor && savedFontSize) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = savedImage;

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Используем сохраненные настройки шрифта
          ctx.fillStyle = savedFontColor;
          ctx.font = `${savedFontSize}px ${selectedFont}`;

          // Начальные координаты для текста, вы можете настроить их как вам нужно
          const x = 10;
          const y = canvas.height - 200;
          const maxWidth = canvas.width - 20; // Учитываем отступы слева и справа
          const lineHeight = savedFontSize * 1.2; // Высота строки

          // Функция для переноса текста на новую строку, если не умещается
          function wrapText(text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            let line = '';

            for (let i = 0; i < words.length; i++) {
              const testLine = line + words[i] + ' ';
              const testWidth = ctx.measureText(testLine).width;
              if (testWidth > maxWidth && i > 0) {
                ctx.fillText(line, x, y);
                line = words[i] + ' ';
                y += lineHeight;
              } else {
                line = testLine;
              }
            }
            ctx.fillText(line, x, y);
          }

          // Вызываем функцию для переноса текста
          wrapText(savedQuote, x, y, maxWidth, lineHeight);

          const imageUrl = canvas.toDataURL('image/png');

          const downloadLink = document.createElement('a');
          downloadLink.href = imageUrl;
          downloadLink.download = 'motivation_image.png';

          downloadLink.click();
        };
      } else {
        alert('Нет изображения или цитаты для сохранения.');
      }
    });





  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
});