// Déclaration d'un tableau contenant les mots secrets possibles (Definiowanie tablicy zawierającej możliwe tajne słowa)
const MOTS_SECRETS = ["AMICUS", "DOMUS", "EQUUS", "NUBES", "ARBOR", "IGNIS", "CORPUS"];

// Déclaration d'un tableau élargi contenant tous les mots valides acceptés par le jeu (Definiowanie rozszerzonej tablicy zawierającej wszystkie poprawne słowa akceptowane przez grę)
const MOTS_VALIDES = ["AMICUS", "DOMUS", "EQUUS", "NUBES", "ARBOR", "IGNIS", "CORPUS", "ROSAE", "PUERI", "MAGNA", "VERUM"];

// Sélection aléatoire d'un mot secret parmi le tableau MOTS_SECRETS (Losowy wybór tajnego słowa z tablicy MOTS_SECRETS)
const motSecret = MOTS_SECRETS[Math.floor(Math.random() * MOTS_SECRETS.length)];

// Définition du nombre maximum d'essais autorisés (Definiowanie maksymalnej dozwolonej liczby prób)
const ESSAIS_MAX = 6;

// Définition de la longueur obligatoire de chaque mot (Definiowanie obowiązkowej długości każdego słowa)
const LONGUEUR_MOT = 5;

// Variable pour suivre la ligne (l'essai) actuelle du joueur, commence à 0 (Zmienna śledząca aktualny wiersz (próbę) gracza, zaczyna się od 0)
let essaiActuel = 0;

// Variable pour suivre la colonne (la lettre) actuelle dans la ligne, commence à 0 (Zmienna śledząca aktualną kolumnę (literę) w wierszu, zaczyna się od 0)
let lettreActuelle = 0;

// Création d'une grille vide sous forme de matrice 2D (6 lignes, 5 colonnes) (Tworzenie pustej siatki w formie macierzy 2D (6 wierszy, 5 kolumn))
let grilleMots = Array(ESSAIS_MAX).fill("").map(() => Array(LONGUEUR_MOT).fill(""));

// Variable booléenne pour bloquer le jeu une fois qu'il est gagné ou perdu (Zmienna logiczna do zablokowania gry po jej wygraniu lub przegraniu)
let jeuFini = false;

// Attente que tout le document HTML soit chargé avant d'exécuter le code (Oczekiwanie na załadowanie całego dokumentu HTML przed uruchomieniem kodu)
document.addEventListener("DOMContentLoaded", () => {
    // Appel de la fonction pour créer la grille visuelle (Wywołanie funkcji tworzącej wizualną siatku)
    creerGrille();
    // Appel de la fonction pour créer le clavier virtuel (Wywołanie funkcji tworzącej wirtualną klawiaturę)
    creerClavier();
    // Appel de la fonction pour écouter le clavier de l'ordinateur (Wywołanie funkcji nasłuchującej klawiaturę komputera)
    ecouterClavierPhysique();
});

// Fonction qui génère les cases de la grille dans le HTML (Funkcja generująca kafelki siatki w HTML)
function creerGrille() {
    // Récupération de l'élément conteneur de la grille depuis le HTML (Pobranie elementu kontenera siatki z HTML)
    const grilleConteneur = document.getElementById("game-grid");
    
    // Boucle pour créer les 6 lignes (Pętla tworząca 6 wierszy)
    for (let r = 0; r < ESSAIS_MAX; r++) {
        // Création d'un élément div pour la ligne (Utworzenie elementu div dla wiersza)
        const ligne = document.createElement("div");
        // Attribution de la classe CSS "row" à la ligne (Przypisanie klasy CSS "row" do wiersza)
        ligne.className = "row";
        
        // Boucle interne pour créer les 5 colonnes (lettres) par ligne (Wewnętrzna pętla tworząca 5 kolumn (liter) w wierszu)
        for (let c = 0; c < LONGUEUR_MOT; c++) {
            // Création d'un élément div pour une case individuelle (Utworzenie elementu div dla pojedynczego kafelka)
            const caseLettre = document.createElement("div");
            // Attribution de la classe CSS "tile" à la case (Przypisanie klasy CSS "tile" do kafelka)
            caseLettre.className = "tile";
            // Stockage du numéro de ligne dans un attribut de données (Przechowywanie numeru wiersza w atrybucie danych)
            caseLettre.dataset.row = r;
            // Stockage du numéro de colonne dans un attribut de données (Przechowywanie numeru kolumny w atrybucie danych)
            caseLettre.dataset.col = c;
            // Ajout de la case à l'intérieur de la ligne (Dodanie kafelka do wewnątrz wiersza)
            ligne.appendChild(caseLettre);
        }
        
        // Ajout de la ligne complète à l'intérieur du conteneur principal de la grille (Dodanie kompletnego wiersza do głównego kontenera siatki)
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