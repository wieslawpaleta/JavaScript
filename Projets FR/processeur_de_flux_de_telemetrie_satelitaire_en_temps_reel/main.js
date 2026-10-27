const { Readable, Transform } = require('stream');
const fs = require('fs');

// 1. ÉTAPE D'EXTRACTION : Simulation d'un flux continu de satellites (KROK EKSTRAKCJI: Symulacja ciągłego strumienia satelitów)
class SatelliteTelemetryStream extends Readable {
    constructor(options) {
        super(options);
        this.count = 0;
    }

    _read() {
        if (this.count >= 5) {
            this.push(null); // Fin du flux de données (Koniec strumienia danych)
            return;
        }

        setTimeout(() => {
            const telemetry = {
                satId: `SAT-${Math.floor(Math.random() * 100)}`,
                altitudeKm: Math.floor(Math.random() * 500) + 200, // Altitude en kilomètres (Wysokość w kilometrach)
                velocityKmS: parseFloat((Math.random() * 3 + 7).toFixed(2)), // Vitesse orbitale en km/s (Prędkość orbitalna w km/s)
                massKg: 1500 // Masse du satellite en kilogrammes (Masa satelita w kilogramach)
            };
            this.push(JSON.stringify(telemetry) + '\n');
            this.count++;
        }, 1000);
    }
}

// Étape de Transformation : Calcul physique de l'energie cinetique (Krok Transformacji: Fizyczne obliczenie energii kinetycznej)
const physicsTransform = new Transform({
    readableObjectMode: true,
    writableObjectMode: false,
    transform(chunk, encoding, callback) {
        try {
            const data = JSON.parse(chunk.toString());

            // Conversion de la vitesse en m/s pour la formule physique (Konwersja prędkości na m/s do wzoru fizycznego)
            const velocityMS = data.velocityKmS * 1000;
            
            // Formule de l'énergie cinétique : E = 0.5 * m * v^2 (Wzór na energię kinetyczną: E = 0.5 * m * v^2)
            const kineticEnergyJoules = 0.5 * data.massKg * Math.pow(velocityMS, 2);

            const enrichedData = {
                timestamp: new Date().toISOString(),
                ...data,
                kineticEnergyMJ: parseFloat((kineticEnergyJoules / 1e6).toFixed(2)) // Énergie en mégajoules (Energia w megadżulach)
            };

            callback(null, JSON.stringify(enrichedData) + '\n');
        } catch (err) {
            callback(err);
        }
    }
});

// Création du fichier de destination (Utworzenie pliku docelowego)
const fileWriteStream = fs.createWriteStream('telemetry_output.jsonl', { flags: 'w' });

console.log("Démarrage du pipeline ETL de télémétrie spatiale... (Uruchamianie rurociągu ETL telemetrii kosmicznej...)");

// Création et exécution du pipeline complet avec .pipe() (Utworzenie i wykonanie pełnego rurociągu za pomocą .pipe())
const telemetryStream = new SatelliteTelemetryStream();

telemetryStream
    .pipe(physicsTransform)
    .on('data', (chunk) => {
        console.log("Donnée transformée et prête : (Przekształcone i gotowe dane:)", chunk.toString().trim());
    })
    .pipe(fileWriteStream)
    .on('finish', () => {
        console.log("Chargement réussi : Toutes les données ont été sauvegardées dans 'telemetry_output.jsonl'. (Ładowanie udane: Wszystkie dane zostały zapisane w 'telemetry_output.jsonl'.)");
    })
    .on('error', (err) => {
        console.error("Erreur dans le pipeline : (Błąd w rurociągu:)", err);
    });