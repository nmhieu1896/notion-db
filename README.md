## Development | manual testing

start with docker

```shellscript
./start.sh
```

start with pnpm

```shellscript
pnpm i
pnpm run dev
```

---

## Non-functional Requirements

- Mimicing the structure of real projects.
- Codebase should me readable, reusable and composable.
- Codebase should be adaptable to requirement changes.
- Be balanced between develop fast and ability to improve quality (UI/UX) in the long run.
- Typesafe

## Technical Decisions

### Technical Stack

- React-aria-components(RAC) for UI systems. This library is best in class for accessibility, headless-ui for customization and saving unused CSS for small bundle size. Others libraries (Antd,Material) is good for fast developement but much worse for customization and accessibility, bundle size is also much larger because of difficulty in tree-shaking. The downside of RAC is not support Multis-Select and Column Rearrangement by drag an drop.
- Tailwindcss for small bundle size, easier for static caching (CDN,local,...) and design system linter.
- Remix for server side rendering. Acting as a replacement for expressjs. Remix is also good enough as a server-state manager.
- React-hook-form because I'm running out of time. But RHF is also powerful for handling forms.
- Typescript

### Structures

- Components should be divided into 3 layers.
  - Layer 1: Builders for compound component (~/builders). This layer build connected components for compound patterns (ex: th,td,tbody,... in a table, connected together by context). These components should be business-isolated and used for build Layer 2.
  - Layer 2: Base components (BaseInput, BaseSelect,...). These components should be maximized for customizing but a bit verbose to use directly. This layer will be in charge for requirement changes.
  - Layer 3: Usable components (FormInput, FormSelect,...). These components should be easy to use (by passing some props).
- Reusable code will be located anywhere except ~/routes. All the code located in a specific route folder is only used for that route. Most of code should be located in routes (like a layer 4 components)
- All Notion's types is extract from their SDK instead of manually define.

### Unfinished task

- Column rearrangement by drag an drop. I've planed to manually implement this feature but currently impossible because of RAC's TH is preventing drag event on header (https://github.com/adobe/react-spectrum/issues/6195). If having more time, I will replace RAC's table with Tanstack-table. All the changes should be done in ~/builders
- Missing Unit test. Time is running out (30 mins left) and I dont know how to write unit test for Frontend.
