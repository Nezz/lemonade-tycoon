### Project guardrails (read me first)

- **Platform**: Expo 54. Prefer expo packages over react native ones.
- **Routing**: Use `expo-router` only. Navigation is file-system based via route groups and layouts.
- **Optimization**: This project uses React Compiler, so rely on it for optimization rather than doing it manually.

### File structure expectations

- `app/` uses Expo Router groups like `(game)`
- TS path alias: `@/*` → repo root. Always import via `@/path` for project files.

### Styling and theming

- Use style sheets for more than one line of style.
- Avoid duplicating styles; prefer shared components.
- Whenever you use an emoji, ensure that it's in icons.ts and export-emojis.html.

### TypeScript and code style

- TypeScript, ESM. No `require` in TS except for assets.
- Explicit return types for exported functions.
- Follow ESLint + Prettier setup; avoid disabling rules.
- Don't create index.ts for exports.
- Don't use types like JSX.Element, rely on inference instead.
- Don't add try-catch blocks unless user code can throw.
- Use `expo-image` instead of `react-native`'s `<Image />`. When blurhash data is available, pass it via the `placeholder` prop.

### Dev commands

- Lint: `bun lint --fix`. Always run this to check and fix the code.
- Type check: `bun check-types`. Always run this to check the code.
- Install packages with `npx expo install <package-name>`. It will use the correct version automatically.
