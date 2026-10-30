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
})