# Features — src/features/

Feature-sliced architecture modules.

## STRUCTURE

```
features/
├── auth/                 # Authentication feature
│   ├── pages/            # LoginPage, RegisterPage
│   └── forms/            # login.ts, register.ts (form schemas)
├── home/                 # Home page feature
│   ├── page/             # HomePage
│   └── components/       # MainFeed, PostCard, Sidebars
└── settings/             # User settings feature
    ├── pages/            # ProfileSettingsPage
    └── components/       # Form sections (Basic, Personal, Work, etc)
```

## CONVENTIONS

### Feature Module Structure
Each feature should have:
```
features/{name}/
├── pages/           # Route-level page components
├── components/      # Feature-specific components
└── forms/           # Form schemas (optional)
```

### Component Organization
- **Pages**: Top-level route components, data fetching
- **Components**: Reusable feature components
- **Forms**: Zod schemas + form handlers

### Naming
- Pages: `{Feature}Page.tsx`
- Components: PascalCase descriptive names
- Forms: camelCase descriptive names

## WHERE TO ADD

| Adding | Location | Notes |
|--------|----------|-------|
| New feature | Create `features/{name}/` | Add pages/, components/ |
| Page component | `features/{name}/pages/` | Export named, use data loaders |
| UI component | `features/{name}/components/` | Keep focused on single feature |
| Form schema | `features/{name}/forms/` | Zod schema + default values |

## ANTI-PATTERNS

- Don't share components across features — move to `components/` instead
- Don't put business logic in pages — use tRPC hooks
- Don't import from other features directly
