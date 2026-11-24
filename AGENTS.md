# Guidelines for AI agents.

## Project overview

This is the Happy While Away Hackathon project. Happy Dogs is a direct-to-consumer e-commerce storefront launching WiggleTug, an automated motorized zig-zag rope and smart spring tug toy engineered to keep dogs happily engaged across an entire workday while their owners are away. The project combines a realistic, hardware-grade pet invention with a complete end-to-end online shopping experience-from product discovery and customization through to cart management, checkout, and order confirmation.

## Tech Stacks & Deployments

- **Framework:** React 19+ (Stable) + Next.js 16.4 (App Route) + TypeScript v7.
- **Styling:** Tailwind CSS v4 + Shadcn (only for the components)
- **State & Logic:** Use React 19 hooks (e.g., `use` for data fetching, improved `useActionState`).
- **Animations:** GSAP - Use it for smooth, awwwards winning animations, Lenis - Smooth scrolling
- **Package Manager:** `pnpm`.
- **Production Deployment:** Vercel

## Build & Test commands

- Don't use the npm commands, instead use the pnpm for building, testing, and deploying the project
- Don't run the pnpm deploy and pnpm build commands automatically, it will be done manually
- Don't run the pnpm preview, because the user manually need to run this as administator.

```bash
# Start the project
pnpm dev

# Build command
pnpm build

# Testing linting
pnpm lint

# Preview command
pnpm preview
```

## Code style guidelines

- Always follow the themes and styles present in the globals.css (app/globals.css)
- While using the tailwindcss must use predefined classes only, don't use the arbitrary values - ex., bg-\[#316ff6]
- The design must be responsive that adapt all the screen sizes
- Provide the short one line comments for better understanding and readability, Use the JSDoc style commenting
  Example:

```ts
/**
 * The next.js on the Vercel need a resolver
 * @returns The resolved env secrets only based on the environment
 */
```

- Use `PascalCase` for React components (`Component.tsx`) and `camelCase` for lib/hooks (`useHook.ts`).
- Use the `useActionState` hook for data fetching and state management.
- Avoid `any` must strict type, Prefer `interface` for component props and `type` for state and constants, use `as const` for literal types
- Avoid the empty last line in the code file.
- Follow the below styles for the code blocks
  Example:

```ts
// Do like this
if(variable) {

}
else {

}

try {

}
catch(error) {

}

// Do not use like this
if (variable) {

} else {

}

try {

} catch(error) {
    
}

```

Note: You must use the up-to-date syntax and best practices, for this use the available skills and context7 MCP for the document references.

## Security considerations

- Don't look the .env, .next, out, and node\_modules files/directories, init.py, submit.py, hwa-start.cmd files, even you have access to them
- Ask the confirmation to the user before delete the file or directory.
- Avoid the AI slops.
- Do not modify competition or environment setup files (`init.py`, `submit.py`, `hwa-start`, `opencode.json`, `.hwa/`).

## Project Structure

```
app
    +---_components --> Reusable components
    |   |
    |   +---layout --> General layouts like the header & footer
    |   |
    |   +---ui --> shadcn UI components
    |   |   |
    |
    +---_sections --> section & subsection components
    |   |
    |
   lib
    |  lenis.ts --> Lenis configuration
    |  types.ts --> where the types are defined
    |  utils.ts --> Utility functions
    |   
    +---hooks --> custom hooks
    |      useScroll.tsx --> Handle the scroll events
    |
    +---providers --> provider components
    |   DependenciesCheckProvider.tsx --> Check the dependencies installation
    |   PluginProvider.tsx --> Central GSAP Plugin register and lenis register
    |
    +---enums --> Application related enums
```

## PR Instructions

- If the user asked to open the PR or ask for the summary of the changes made on the code, provide the short and sweet summary of the changes made.
- No emoji's are allowed in the PR title and summary.
- Make sure to follow the PR instructions and guidelines provided by the repository or project you are contributing to.
- If you are unsure about something, don't hesitate to ask for clarification or seek help from the user.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` - verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->