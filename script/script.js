const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bmt3c3Bscm5hc2Z5eHV0YXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMwNTU2NjEsImV4cCI6MjAwODYzMTY2MX0.m8SbumGRrHqY0L-DJ0FiMzlfrvdogBe32L-hgJM_NHo";
const headers = new Headers();
headers.append("apikey", apiKey);

const BASE_URL = 'https://htnkwsplrnasfyxutazx.supabase.co/rest/v1';

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