## Tech Stack

- Node 16
- NPM
- Nuxt V3 (SPA / Static Generator)
- VueJS 3 (Composition API Style)
- TypeScript
- Tailwind CSS
- Atomic Design
  - Components/Atoms…
  - Components/Molecules…
  - Composables/useData.ts
- SASS
- Storybook (Not for now)
- ESLint+Husky+Lint-Staged (Not for now)
- iTest (in case we use unit tests)

We strongly encourage the use of Composition API and global sharing with VueUse when needed. Vuex is not preferred in this project.

## Setup

To setup the project, install the dependencies using:

```bash
npm install
```

## Development Server

Start the development server on [http://localhost:3000](http://localhost:3000) with:

```bash
npm run dev
```

## Production

To build the application for production:

```bash
npm run build
```

To locally preview production build:

```bash
npm run preview
```

## Guide: Adding a new game

2. To add a new game please use organisms/game.vue , but you are not able to add any specific thing regarding the game there, use slots as coinflip or slidedice.
3. every new special component for x game must be under atoms/games/name_of_the_game/x.vue or molecules/games/name_of_the_game/x.vue
4. Must not be any store under ./store/.\* regarding any game, create a file called useYourGame.ts under composables, similar what we do on useCoinflip where we handle an animation state (use createGlobalState vueuse to keep the state across the components)
5. within useMinigames there are smart contract integrations and integrations with other specific games composables, so if you have something special to trigger must be from there, follow coinflip approach in any moment.
6. must not be any specific game code in any general purpose atom that is being re-used, if you need to do something on stakebutton for instance, create a new one like <GamePlay /> and within this, use currentGame state from useMinigame to check what to show. but dont change common buttons that are used across the app, create global GameX components for common usages within game spectrum.
7. dont add any particular code under any general method such as playTheGame or others, use the coinflip approach.

For more information on deployment, check out the [Nuxt 3 deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets).
