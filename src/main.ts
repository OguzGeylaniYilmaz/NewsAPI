let lastQuery = "";
let lastLanguage = "";
let lastSortBy = "";

async function fetchNews() {
  const apiKey: string = import.meta.env.VITE_API_KEY;

  const query = (document.getElementById("search") as HTMLInputElement).value;
  const language = (document.getElementById("language") as HTMLSelectElement)
    .value;
  const sortBy = (document.getElementById("sort") as HTMLSelectElement).value;

  const apiUrl = `https://newsapi.org/v2/everything?q=${query}&language=${language}&sortBy=${sortBy}&apiKey=${apiKey}`;

  document.getElementById("news-container")!.innerHTML = "";

  if (
    query === lastQuery &&
    language === lastLanguage &&
    sortBy === lastSortBy
  ) {
    console.log(
      "Die gleiche Abfrage wurde wiederholt, es wurden keine API-Aufrufe getätigt."
    );
    return;
  }

  lastQuery = query;
  lastLanguage = language;
  lastSortBy = sortBy;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);

    if (data.status === "error") {
      console.error("API Error:", data.message);
      return;
    }
    displayNews(data.articles);
  } catch (error) {
    console.log("Beim Abrufen der Nachrichten ist ein Fehler aufgetreten:");
  }
}

function displayNews(
  articles: {
    title: string;
    urlToImage: string;
    description: string;
    url: string;
  }[]
) {
  const newsContainer = document.getElementById("news-container");

  articles.forEach((article) => {
    const newsCard = document.createElement("div");
    newsCard.classList.add("news-card");

    newsCard.innerHTML = ` <h3>${article.title}</h3>
    <p>${
      article.description
        ? article.description.substring(0, 350) + "..."
        : "Keine Beschreibung verfügbar"
    }</p>
                    <img src="${
                      article.urlToImage || "https://via.placeholder.com/300"
                    }" alt="News Image">
                    
                    <a href="${article.url}" target="_blank">Mehr lesen</a>`;
    newsCard.classList.add("news-card");

    newsContainer?.appendChild(newsCard);
  });
}

document.getElementById("searchBtn")?.addEventListener("click", fetchNews);
