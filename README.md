# cdl — Directory Link Manager

Navigate your projects instantly. Register directory paths with short aliases and jump to them from anywhere.

```bash
cdl add my-blog /Users/you/code/my-blog
cdl my-blog   # cd /Users/you/code/my-blog
```

## Install

```bash
npm install -g @arahansa/cdl
# or
pnpm add -g @arahansa/cdl
```

After installing, run the shell integration setup:

```bash
cdl init
source ~/.zshrc
```

This adds a shell function and tab completion to your `.zshrc`.

## Usage

### Register a directory

```bash
# Register current directory
cdl add my-blog

# Register a specific path
cdl add api-server /Users/you/code/api-server

# Register with port info
cdl add api-server /Users/you/code/api-server --port 3000

# Register with a description
cdl add api-server /Users/you/code/api-server --desc "Main REST API"
```

### Jump to a directory

```bash
cdl my-blog
# => cd /Users/you/code/my-blog
```

Tab completion works — press `Tab` after `cdl` to see all registered aliases and subcommands.

### List all links

```bash
cdl list
# my-blog     → /Users/you/code/my-blog     (Personal blog)
# api-server  → /Users/you/code/api-server   (Main REST API)  [ports: 3000]
```

### Remove a link

```bash
cdl rm my-blog
```

### Manage ports

```bash
cdl port api-server add 3000 3001
cdl port api-server list
cdl port api-server rm 3001
```

### Manage descriptions

```bash
# Set a description
cdl desc api-server set Main REST API

# Shorthand (omit "set")
cdl desc api-server Main REST API

# View description
cdl desc api-server

# Remove description
cdl desc api-server rm
```

## Commands

| Command | Description |
|---------|-------------|
| `cdl add <alias> [path] [--port <port>...] [--desc <text>]` | Register a directory (defaults to current dir) |
| `cdl rm <alias>` | Remove an alias |
| `cdl list` | List all registered aliases |
| `cdl port <alias> <add\|rm\|list> [port...]` | Manage ports for an alias |
| `cdl desc <alias> [set <text> \| rm]` | Manage description for an alias |
| `cdl init` | Set up shell integration in `.zshrc` |
| `cdl help` | Show help message |

## How It Works

- Aliases are stored in `~/.cdl/links.json`
- `cdl init` adds a zsh function to `.zshrc` that wraps the CLI — when you type `cdl <alias>`, it resolves the path and runs `cd`
- Subcommands (`add`, `rm`, `list`, `port`, `desc`, `init`) are passed through to the Node.js CLI

## Shell Support

Currently supports **zsh** with tab completion.

## License

MIT
