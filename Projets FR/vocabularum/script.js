// !!!
// NAPISZ PROGRAM, KTÓRY PRZEFILTRUJE KSIĄŻKI PO ŁACINIE W POSZUKIWANIU PIĘCIOLITEROWYCH SŁÓW
// !!!

// Liste de mots en latin classique de 5 lettres (Lista słów w klasycznej łacinie o długości 5 liter)
// Note: En latin classique, nous utilisons 'V' et non 'U' de préférence, mais ici nous gardons l'alphabet moderne pour la simplicité du jeu.
// (Uwaga: W klasycznej łacinie częściej używa się 'V' zamiast 'U', ale tutaj zachowujemy współczesny alfabet dla prostoty gry).
const MOTS_LATINS = ["AMICUS", "DOMUS", "EQUUS", "ACERB", "NUBES", "ARBOR", "IGNIS", "CORPUS"];

// Choix aleatoire du mot secret (Losowy wybór ukrytego słowa)
const motSecret = MOTS_LATINS[Math.floor(Math.random() * MOTS_LATINS.length)];

const ESSAIS_MAX = 6;
const LONGUEUR_MOT = 5;

let essaiActuel = 0;
let lettreActuelle = 0;
let grilleMots = Array(ESSAIS_MAX).fill("").map(() => Array(LONGUEUR_MOT).fill(""));

// Initialisation de l'interface (Inicjalizacja interfejsu)
document.addEventListener("DOMContentLoaded", () => {
    creerGrille();
    creerClavier();
    ecouterClavierPhysique;
});

// Initialisation de l'interface (Inicjalizacja interfejsu)
function creerGrille() {
    const grilleConteneur = document.getElementById("game-grid");

    for (let r = 0; r < ESSAIS_MAX; r++) {
        const ligne = document.createElement("div");
        ligne.className = "row";
        ligne.dataset.row = r;

        for (let c = 0; c < LONGUEUR_MOT; c++) {
            const caseLettre = document.createElement("div");
            caseLettre.className = "tile";
            caseLettre.dataset.row = r;
            caseLettre.dataset.col = c;
            ligne.appendChild(caseLettre);
        }

        grilleConteneur.appendChild(ligne);
    }
}

// Creation du clavier virtuel (Tworzenie wirtualnej klawiatury)
function creerClavier() {
    const conteneurClavier = document.getElementById("keyboard");
    const dispositionClavier = [
        ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        ["L", "M", "N", "O", "P", "Q", "R", "S", "T"],
        ["ENTER", "U", "V", "X", "Z", "BACKSPACE"]
    ];

    dispositionClavier.forEach(ligneMots => {
        const ligneElement = document.createElement("div");
        ligneElement.className = "keyboard0-row";

        ligneMots.forEach(cle => {
            const boutonCle = document.createElement("button");
            boutonCle.textContent = cle === "BACKSPACE" ? "⌫" : cle;
        })
    })
}