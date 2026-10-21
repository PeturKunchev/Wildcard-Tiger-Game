# Wildcard Tiger Game

A browser-based game built with PixiJS, TypeScript, and GSAP for the Wildcard Frontend Game Developer challenge.

The objective is to free the tiger by opening six numbered cage bars in the correct randomly generated sequence.

## Features

- Random unlock sequences containing all six numbered bars.
- Animated bars that slide outward when selected correctly.
- Automatic reset when an incorrect bar is selected.
- Tiger escape animation and "Going Wild" victory text.
- Progress meter displaying the remaining locked bars.
- Animated bar shadows.
- Responsive layout for different screen sizes.

## Technologies

- [PixiJS](https://pixijs.com/) — 2D rendering.
- [GSAP](https://gsap.com/) — animations.
- [TypeScript](https://www.typescriptlang.org/) — application logic and type safety.
- [Vite](https://vite.dev/) — development server and production builds.

## Prerequisites

- [Node.js](https://nodejs.org/) and npm.

## Installation

Clone the repository and navigate to the project directory:

bash
git clone <repository-url>
cd Wildcard-Tiger-Game


Install the dependencies:

bash
npm install


Replace `<repository-url>` with the URL of your repository.

## Development

Start the Vite development server:

bash
npm run start


Open the local URL displayed in the terminal to play the game.

The randomly generated unlock sequence is logged in the browser console.

## Building for Production

Run the TypeScript compiler and create the production build:

bash
npm run build


The generated production files are placed in the `dist/` directory.

To preview the production build locally:

bash
npm run build
npm run preview


## How to Play

1. Check the browser console for the generated unlock sequence.
2. Select the numbered bars in the displayed sequence.
3. Selecting an incorrect bar resets the attempt and generates a new sequence.
4. Open all six bars to trigger the tiger's escape animation.
5. The game resets after five seconds, allowing another attempt.

