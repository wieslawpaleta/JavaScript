# Wordle Classicum (Latin / Łacina klasyczna)

## 🇫🇷 Présentation du Projet

**Wordle Classicum** est un jeu de lettres inspiré de *Wordle*, basé sur des mots de **5 lettres en latin classique** (hors latin ecclésiastique). Ce projet a été développé en **HTML5, CSS3 et JavaScript pur (*Vanilla JS*)** dans le cadre de mon apprentissage du JavaScript et de la création d'un projet original pour mon portfolio.

### ✨ Fonctionnalités principales
- **Grille de 6 essais** avec saisie via le clavier virtuel ou le clavier physique.
- **Animations CSS fluides** : effet *pop* lors de la saisie d'une lettre et retournement 3D séquentiel (*flip*) révélant l'état des lettres (position exacte, présente ailleurs, absente).
- **Dictionnaire et validation** : vérification que le mot proposé de 5 lettres figure dans la liste des mots latins valides.
- **Définition et étymologie** : affichage du sens et de l'origine étymologique du mot latin à la fin de la partie.
- **Statistiques persistantes (`localStorage`)** : suivi du nombre de parties jouées, du pourcentage de victoires, de la série actuelle et de la meilleure série.
- **Notifications animées (*toasts*)** : messages non bloquants pour signaler les mots incomplets ou absents du dictionnaire.
- **Effets sonores synthétiques (Web Audio API)** : sons générés dynamiquement en JavaScript (frappe, suppression, erreur, victoire, défaite) sans fichiers audio externes, avec bouton **muet / actif**.
- **Mode sombre et mode clair** : bascule visuelle via variables CSS (`:root`) avec sauvegarde de la préférence dans `localStorage`.

### 🛠️ Technologies utilisées
- **HTML5** : structure sémantique, grille, clavier virtuel, modale de fin de partie et conteneur de *toasts*.
- **CSS3** : CSS Grid, animations `@keyframes`, transformations 3D (`rotateX`) et variables CSS pour le thème clair/sombre.
- **JavaScript (ES6+)** : manipulation du DOM, gestion d'événements, `setTimeout`, `localStorage` et **Web Audio API** (`AudioContext`, `OscillatorNode`, `GainNode`).

### 🚀 Lancer le projet en local
1. Clone ou télécharge le dépôt contenant `index.html`, `style.css` et `script.js`.
2. Ouvre simplement `index.html` dans un navigateur web moderne (aucune installation ni serveur requis).

---

## 🇵🇱 Opis Projektu

**Wordle Classicum** to gra słowna inspirowana *Wordle*, oparta na **5-literowych słowach w klasycznej łacinie** (z pominięciem łaciny kościelnej). Projekt powstał w **HTML5, CSS3 oraz czystym JavaScript (*Vanilla JS*)** w ramach nauki JavaScriptu i budowy autorskiego projektu do portfolio.

### ✨ Najważniejsze funkcje
- **Siatka 6 prób** z obsługą klawiatury ekranowej oraz fizycznej klawiatury.
- **Płynne animacje CSS** : efekt *pop* przy wpisywaniu litery oraz sekwencyjny obrót 3D (*flip*) ujawniający status liter (właściwe miejsce, litera obecna w innym miejscu, brak w słowie).
- **Słownik i walidacja** : sprawdzanie, czy wpisane 5-literowe słowo znajduje się na liście poprawnych słów łacińskich.
- **Definicja i etymologia** : wyświetlanie znaczenia oraz pochodzenia etymologicznego łacińskiego słowa po zakończeniu rozgrywki.
- **Statystyki zapisywane w `localStorage`** : licznik rozegranych gier, procent zwycięstw, aktualna seria wygranych oraz najlepsza seria.
- **Animowane powiadomienia (*toasty*)** : lekkie komunikaty informujące np. o zbyt krótkim słowie lub braku słowa w słowniku.
- **Syntetyczne efekty dźwiękowe (Web Audio API)** : dźwięki generowane w locie w JavaScript (wpisywanie, usuwanie, błąd, wygrana, przegrana) bez zewnętrznych plików audio, z przyciskiem **wyciszania / włączania dźwięku**.
- **Tryb ciemny i jasny** : zmiana wyglądu oparta na zmiennych CSS (`:root`) z zapamiętywaniem wyboru w `localStorage`.

### 🛠️ Użyte technologie
- **HTML5** : struktura aplikacji, siatka gry, klawiatura wirtualna, okno modalne i kontener *toastów*.
- **CSS3** : CSS Grid, animacje `@keyframes`, przekształcenia 3D (`rotateX`) oraz zmienne CSS dla motywu ciemnego i jasnego.
- **JavaScript (ES6+)** : manipulacja DOM, obsługa zdarzeń, `setTimeout`, `localStorage` oraz **Web Audio API** (`AudioContext`, `OscillatorNode`, `GainNode`).

### 🚀 Uruchomienie lokalne
1. Sklonuj lub pobierz pliki `index.html`, `style.css` oraz `script.js`.
2. Otwórz plik `index.html` w dowolnej współczesnej przeglądarce internetowej (nie wymaga instalacji zależności ani serwera).