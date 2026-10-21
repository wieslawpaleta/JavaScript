// Initialisation du tableau de données brutes provenant de l'API (Inicjalizacja tablicy surowych danych pochodzących z API)
const rawDataStream = [
    { id: 1, city: "Paris", temperature: 22.5, humidity: 65, timestamp: "2026-06-01T10:00:00Z" },
    { id: 2, city: "London", temperature: 18.0, humidity: 80, timestamp: "2026-06-01T10:00:00Z" },
    { id: 3, city: "Paris", temperature: 23.1, humidity: 60, timestamp: "2026-06-01T11:00:00Z" },
    { id: 4, city: "Berlin", temperature: null, humidity: 50, timestamp: "2026-06-01T10:00:00Z" }, // Donnée corrompue (Uszkodzone dane)
];

// Fonction de nettoyage et transformation des données (Funkcja czyszczenia i transformacji danych)
function transformWeatherData(data) {
    return data
        // Étape 1 : Supprimer les enregistrements avec des valeurs manquantes (Krok 1: Usunięcie wpisów z brakującymi wartościami)
        .filter(record => record.temperature !== null && record.humidity !== null)
        
        // Étape 2 : Transformer les unités ou formater les champs (Krok 2: Transformacja jednostek lub formatowanie pól)   
    }