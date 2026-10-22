// Coordonnées des villes à analyser (Współrzędne miast do analizy)
const CITIES = [
    { name: "Paris", lat: 48.8566, lon: 2.3522 },
    { name: "Varsovie", lat: 52.2297, lon: 21.0122 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "New York", lat: 40.7128, lon: -74.0060 }
];

// Étape 1 : Extract - Récupération des données depuis l'API (Krok 1: Extract - Pobieranie danych z API)
async function fetchWeatherData(city) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        return {
            city: city.name,
            temperature: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m,
            timestamp: data.current.time
        };
    } catch (error) {
        console.error(`Erreur lors de la récupération pour ${city.name} (Błąd podczas pobierania dla ${city.name}):`, error);
        return null;
    }
}

// Étape 2 : Transform - Traitement et agrégation des données (Krok 2: Transform - Przetwarzanie i agregacja danych)
function transformAndAggregate(rawDataList) {
    // Filtrer les erreurs éventuelles (Filtrowanie ewentualnych błędów)
    const validData = rawDataList.filter(item => item !== null);

    // Calcul de la température moyenne (Obliczenie średniej temperatury)
    const totalTemp = validData.reduce((sum, item) => sum + item.temperature, 0);
    const avgTemp = (totalTemp / validData.length).toFixed(2);

    // Recherche de la ville la plus chaude (Wyszukanie najcieplejszego miasta)
    const hottestCity = validData.reduce((prev, current) => 
        (prev.temperature > current.temperature) ? prev : current
    );

    return {
        processedCities: validData,
        metrics: {
            averageTemperature: parseFloat(avgTemp),
            hottestCity: hottestCity.city,
            maxTemperature: hottestCity.temperature
        }
    };
}

// Main ETL Pipeline (Główny potok ETL)
async function runETLPipeline() {
    console.log("Démarrage du pipeline ETL... (Uruchamianie potoku ETL...)");

    // 1. Extraction en parallèle (Ekstrakcja równoległa)
    const rawDataPromises = CITIES.map(city => fetchWeatherData(city));
    const rawData = await Promise.all(rawDataPromises);

    // 2. Transformation (Transformacja)
    const transformedData = transformAndAggregate(rawData);

    // 3. Load / Display (Ładowanie / Wyświetlanie)
    console.log("--- Résultats du Pipeline (Wyniki Potoku) ---");
    console.table(transformedData.processedCities);
    console.log("--- Métriques Globales (Metryki Globalne) ---", transformedData.metrics);
}

// Exécution de la fonction principale (Wykonanie głównej funkcji)
runETLPipeline();