# Project Rules

## API Query Usage
- Never destructure tRPC query results. Always assign to a single variable.
- Right: `const workflows = api.workflows.getUserHistory.useQuery({ workflowType });`
- Wrong: `const { isPending } = api.workflows.getUserHistory.useQuery({ workflowType });`

## Follow Existing Patterns
- Always read and follow existing code patterns before implementing anything. Do not introduce new patterns or approaches. Match what's already in the codebase.

## Mutations & Toasts
- Always use `mutate`, never `mutateAsync`.
- Always show toast feedback using this pattern:
```ts
const id = toast.loading("Please wait...");
mutation.mutate(payload, {
  onSuccess: () => {
    toast.success("Success message", { id });
  },
  onError: (error) => {
    toast.error(error.message, { id });
  },
});
```

## Cache Invalidation
- Always invalidate relevant queries after a successful mutation. Never skip this.

## Pre-Implementation
- Always check the schema and related code before implementing anything.

## Types
- Use `RouterOutputs` to get API output types. Do not manually create types that duplicate API response shapes.

## HTTP Client
- Always use `axios` instead of `fetch`.

## State Management
- Prefer URL-managed state over `useState`.
- Do not do prop drilling — use context instead.
- Use tRPC query/mutation data directly instead of copying into local state.

## No Comments
- Never write comments in code. No inline comments, no block comments, no JSDoc.

## Function Style
- Always use arrow functions for components. Never use the `function` keyword for components.

## Drizzle ORM
- Always use `select` queries. Do not use the `query` API.

## Database Safety
- NEVER run database migrations, pushes, or any command that modifies the database schema. No `db:push`, `db:migrate`, `drizzle-kit push`, or similar commands.


## CODE
make sure NOT to write repeatable code and the code is modular + production ready + NOT too     
complex or big files everything is clean modular and resuasable components     

## MODULAR CODE
write less complex , modular component code and files , avoid writing big chunk files and code