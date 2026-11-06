// Declaration d'un tableau contenant les mots secrets possibles (Definiowanie tablicy zawierającej możliwe tajne słowa)
const MOTS_LATINS = ["AMICUS", "DOMUS", "EQUUS", "ACERB", "NUBES", "ARBOR", "IGNIS", "CORPUS"];

// Declaration d'un tableau elargi contenant tous les mots valides acceptes par le jeu (Definiowanie rozszerzonej tablicy zawierającej wszystkie poprawne słowa akceptowane przez grę) 
cosnt MOTS_VALIDES = 

const motSecret = MOTS_LATINS[Math.floor(Math.random() * MOTS_LATINS.length)];

const ESSAIS_MAX = 6;
const LONGUEUR_MOT = 5;

let essaiActuel = 0;
let lettreActuelle = 0;
let grilleMots = Array(ESSAIS_MAX).fill("").map(() => Array(LONGUEUR_MOT).fill(""));
let jeuFini = false; // Bloquer la saisie à la fin de la partie (Zablokowanie wpisywania po końcu gry)

document.addEventListener("DOMContentLoaded", () => {
    creerGrille();
    creerClavier();
    ecouterClavierPhysique();
});

function creerGrille() {
    const grilleConteneur = document.getElementById("game-grid");
    for (let r = 0; r < ESSAIS_MAX; r++) {
        const ligne = document.createElement("div");
        ligne.className = "row";
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
            boutonCle.dataset.key = cle; // Attribut pour sélectionner la touche facilement (Atrybut do łatwego wyboru klawisza)
            if (cle === "ENTER" || cle === "BACKSPACE") {
                boutonCle.classList.add("large");
            }
            
            boutonCle.addEventListener("click", () => traiterTouche(cle));
            ligneElement.appendChild(boutonCle);
        });

        conteneurClavier.appendChild(ligneElement);
    });
}

function ecouterClavierPhysique() {
    document.addEventListener("keydown", (e) => {
        if (jeuFini) return;
        
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

function traiterTouche(touche) {
    if (jeuFini) return;

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
    
    // Déclencher l'animation Pop (Wywołanie animacji Pop)
    caseElement.classList.add("pop");
    caseElement.addEventListener("animationend", () => caseElement.classList.remove("pop"), { once: true });

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

function validerEssai() {
    if (lettreActuelle !== LONGUEUR_MOT) {
        alert("Le mot doit faire 5 lettres ! (Słowo musi mieć 5 liter!)");
        return;
    }

    const motPropose = grilleMots[essaiActuel].join("");
    
    // Animation séquentielle des cases (Sekwencyjna animacja kafelków)
    for (let i = 0; i < LONGUEUR_MOT; i++) {
        const caseElement = document.querySelector(`[data-row='${essaiActuel}'][data-col='${i}']`);
        const lettreProposee = motPropose[i];
        const boutonClavier = document.querySelector(`[data-key='${lettreProposee}']`);

        // Utilisation de setTimeout pour décaler chaque case (Użycie setTimeout dla opóźnienia każdego kafelka)
        setTimeout(() => {
            caseElement.classList.add("flip");

            // Au milieu du retournement (à 250ms), changer la couleur (W połowie obrotu (przy 250ms), zmień kolor)
            setTimeout(() => {
                let statutLettre = "";
                if (lettreProposee === motSecret[i]) {
                    statutLettre = "correct";
                } else if (motSecret.includes(lettreProposee)) {
                    statutLettre = "present";
                } else {
                    statutLettre = "absent";
                }

                caseElement.classList.add(statutLettre);
                
                // Mettre à jour la couleur du clavier virtuel (Aktualizacja koloru wirtualnej klawiatury)
                if (boutonClavier) {
                    if (statutLettre === "correct") {
                        boutonClavier.className = "key correct";
                    } else if (statutLettre === "present" && !boutonClavier.classList.contains("correct")) {
                        boutonClavier.className = "key present";
                    } else if (!boutonClavier.classList.contains("correct") && !boutonClavier.classList.contains("present")) {
                        boutonClavier.className = "key absent";
                    }
                }
            }, 250);

        }, i * 300); // 300ms de décalage entre chaque lettre (300ms opóźnienia między każdą literą)
    }

    // Gestion de la fin de partie après la fin des animations (Obsługa końca gry po zakończeniu animacji)
    setTimeout(() => {
        if (motPropose === motSecret) {
            jeuFini = true;
            alert("Félicitations ! Vous avez gagné ! (Gratulacje! Wygrałeś!)");
        } else if (essaiActuel === ESSAIS_MAX - 1) {
            jeuFini = true;
            alert(`Défaite ! Le mot était : ${motSecret} (Porażka! Słowem było: ${motSecret})`);
        } else {
            essaiActuel++;
            lettreActuelle = 0;
        }
    }, LONGUEUR_MOT * 300 + 100);
}