// Liste de mots en latin classique de 5 lettres (Lista słów w klasycznej łacinie o długości 5 liter)
// Note: En latin classique, nous utilisons 'V' et non 'U' de préférence, mais ici nous gardons l'alphabet moderne pour la simplicité du jeu.
// (Uwaga: W klasycznej łacinie częściej używa się 'V' zamiast 'U', ale tutaj zachowujemy współczesny alfabet dla prostoty gry).
const MOTS_LATINS = ["AMICUS", "DOMUS", "EQUUS", "ACERB", "NUBES", "ARBOR", "IGNIS", "CORPUS"];

// Choix aléatoire du mot secret (Losowy wybór ukrytego słowa)
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
    ecouterClavierPhysique();
});

// Création de la grille HTML (Tworzenie siatki HTML)
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

// Création du clavier virtuel (Tworzenie wirtualnej klawiatury)
function creerClavier() {
    const conteneurClavier = document.getElementById("keyboard");
    const dispositionClavier = [
        ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        ["L", "M", "N", "O", "P", "Q", "R", "S", "T"],
        ["ENTER", "U", "V", "X", "Z", "BACKSPACE"]
    ];

    dispositionClavier.forEach(ligneMots => {
        const ligneElement = document.createElement("div");
        ligneElement.className = "keyboard-row";

        ligneMots.forEach(cle => {
            const boutonCle = document.createElement("button");
            boutonCle.textContent = cle === "BACKSPACE" ? "⌫" : cle;
            boutonCle.className = "key";
            if (cle === "ENTER" || cle === "BACKSPACE") {
                boutonCle.classList.add("large");
            }
            
            boutonCle.addEventListener("click", () => traiterTouche(cle));
            ligneElement.appendChild(boutonCle);
        });

        conteneurClavier.appendChild(ligneElement);
    });
}

// Écouter les événements du clavier physique (Słuchanie zdarzeń fizycznej klawiatury)
function ecouterClavierPhysique() {
    document.addEventListener("keydown", (e) => {
        const touche = e.key.toUpperCase();
        if (touche === "ENTER") {
            traiterTouche("ENTER");
        } else if (touche === "BACKSPACE") {
            traiterTouche("BACKSPACE");
        } else if (/^[A-Z]$/.test(touche)) {
            traiterTouche(touche);
        }
    });
}

// Gestion de la logique de frappe (Obsługa logiki naciskania klawiszy)
function traiterTouche(touche) {
    if (touche === "ENTER") {
        validerEssai();
    } else if (touche === "BACKSPACE") {
        effacerLettre();
    } else if (lettreActuelle < LONGUEUR_MOT && essaiActuel < ESSAIS_MAX) {
        ajouterLettre(touche);
    }
}

function ajouterLettre(lettre) {
    grilleMots[essaiActuel][lettreActuelle] = lettre;
    const caseElement = document.querySelector(`[data-row='${essaiActuel}'][data-col='${lettreActuelle}']`);
    caseElement.textContent = lettre;
    lettreActuelle++;
}

function effacerLettre() {
    if (lettreActuelle > 0) {
        lettreActuelle--;
        grilleMots[essaiActuel][lettreActuelle] = "";
        const caseElement = document.querySelector(`[data-row='${essaiActuel}'][data-col='${lettreActuelle}']`);
        caseElement.textContent = "";
    }
}

// Vérification du mot soumis (Sprawdzanie zgłoszonego słowa)
function validerEssai() {
    if (lettreActuelle !== LONGUEUR_MOT) {
        alert("Le mot doit faire 5 lettres ! (Słowo musi mieć 5 liter!)");
        return;
    }

    const motPropose = grilleMots[essaiActuel].join("");
    
    // Comparaison des lettres (Porównywanie liter)
    for (let i = 0; i < LONGUEUR_MOT; i++) {
        const caseElement = document.querySelector(`[data-row='${essaiActuel}'][data-col='${i}']`);
        const lettreProposee = motPropose[i];

        if (lettreProposee === motSecret[i]) {
            caseElement.classList.add("correct");
        } else if (motSecret.includes(lettreProposee)) {
            caseElement.classList.add("present");
        } else {
            caseElement.classList.add("absent");
        }
    }

    if (motPropose === motSecret) {
        setTimeout(() => alert("Félicitations ! Vous avez gagné ! (Gratulacje! Wygrałeś!)"), 100);
    } else if (essaiActuel === ESSAIS_MAX - 1) {
        setTimeout(() => alert(`Défaite ! Le mot était : ${motSecret} (Porażka! Słowem było: ${motSecret})`), 100);
    } else {
        essaiActuel++;
        lettreActuelle = 0;
    }
}