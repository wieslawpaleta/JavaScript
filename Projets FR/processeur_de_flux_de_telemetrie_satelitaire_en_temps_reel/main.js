const { Readable, Transform } = require('stream');
const fs = require('fs');

// 1. ÉTAPE D'EXTRACTION : Simulation du flux de télémétrie (KROK EKSTRAKCJI: Symulacja strumienia telemetrii)
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

// Variables d'état pour l'agrégation et le stockage (Zmienne stanu do agregacji i przechowywania)
let totalKineticEnergy = 0;
let maxVelocity = 0;
let fastestSatellite = null;
let processedCount = 0;
const allRecords = []; // Tableau pour stocker les données destinées à la visualisation tabulaire (Tablica do przechowywania danych do wizualizacji tabelarycznej)

// 2. ÉTAPE DE TRANSFORMATION ET VISUALISATION EN DIRECT (KROK TRANSFORMACJI I WIZUALIZACJI NA ŻYWO)
const physicsTransform = new Transform({
    readableObjectMode: false,
    writableObjectMode: false,
    transform(chunk, encoding, callback) {
        try {
            const data = JSON.parse(chunk.toString());
            
            // Conversion de la vitesse en m/s (Konwersja prędkości na m/s)
            const velocityMS = data.velocityKmS * 1000;
            
            // Calcul de l'énergie cinétique (Obliczenie energii kinetycznej)
            const kineticEnergyJoules = 0.5 * data.massKg * Math.pow(velocityMS, 2);
            const kineticEnergyMJ = parseFloat((kineticEnergyJoules / 1e6).toFixed(2));

            const enrichedData = {
                timestamp: new Date().toISOString(),
                ...data,
                kineticEnergyMJ
            };

            // Mise à jour des statistiques (Aktualizacja statystyk)
            processedCount++;
            totalKineticEnergy += kineticEnergyMJ;
            
            if (data.velocityKmS > maxVelocity) {
                maxVelocity = data.velocityKmS;
                fastestSatellite = data.satId;
            }

            // Enregistrement des données propres pour l'affichage en tableau final (Zapis czystych danych do wyświetlenia w końcowej tabeli)
            allRecords.push({
                ID: enrichedData.satId,
                'Altitude (km)': enrichedData.altitudeKm,
                'Vitesse (km/s)': enrichedData.velocityKmS,
                'Masse (kg)': enrichedData.massKg,
                'Énergie (MJ)': enrichedData.kineticEnergyMJ
            });

            // Visualisation graphique simple dans la console (Prosta wizualizacja graficzna w konsoli)
            const barLength = Math.min(Math.floor(kineticEnergyMJ / 1000), 20);
            const visualBar = '█'.repeat(barLength);
            console.log(`[STREAM] ${enrichedData.satId} | Énergie: [${visualBar.padEnd(20, ' ')}] ${kineticEnergyMJ} MJ`);

            callback(null, JSON.stringify(enrichedData) + '\n');
        } catch (err) {
            callback(err);
        }
    }
});

// 3. ÉTAPE DE CHARGEMENT : Fichier de destination (KROK ŁADOWANIA: Plik docelowy)
const fileWriteStream = fs.createWriteStream('telemetry_output.jsonl', { flags: 'w' });

console.log("Démarrage du pipeline ETL avec visualisation... (Uruchamianie rurociągu ETL z wizualizacją...\n)");

const telemetryStream = new SatelliteTelemetryStream();

telemetryStream
    .pipe(physicsTransform)
    .pipe(fileWriteStream)
    .on('finish', () => {
        // 4. AFFICHAGE DU TABLEAU RÉCAPITULATIF ET DES STATISTIQUES (4. WYŚWIETLANIE TABELI PODSUMOWUJĄCEJ I STATYSTYK)
        console.log("\n==========================================");
        console.log("   TABLEAU DE BORD DES DONNÉES (PULPIT DANYCH)");
        console.log("==========================================");
        
        // Affichage natif d'un tableau stylisé dans le terminal (Natywne wyświetlanie stylowej tabeli w terminalu)
        console.table(allRecords);

        const averageEnergy = processedCount > 0 ? (totalKineticEnergy / processedCount).toFixed(2) : 0;
        
        console.log("==========================================");
        console.log("       RAPPORT D'ANALYSE FINALE (KOŃCOWY RAPORT ANALIZY)");
        console.log("==========================================");
        console.log(`Total satellites analysés : ${processedCount} (Łącznie przeanalizowanych satelitów: ${processedCount})`);
        console.log(`Énergie cinétique moyenne : ${averageEnergy} MJ (Średnia energia kinetyczna: ${averageEnergy} MJ)`);
        console.log(`Satellite le plus rapide : ${fastestSatellite} (${maxVelocity} km/s) (Najszybszy satelita: ${fastestSatellite} (${maxVelocity} km/s))`);
        console.log("==========================================");
        console.log("Chargement terminé : Données sauvegardées dans 'telemetry_output.jsonl'. (Ładowanie zakończone: Dane zapisane w 'telemetry_output.jsonl'.)");
    })
    .on('error', (err) => {
        console.error("Erreur du pipeline : (Błąd rurociągu:)", err);
    });