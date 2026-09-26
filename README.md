# Media-Dex

A personal catalog of media I love — games, manhwa & manga, movies & TV series, and music. Built for fun and personal archiving, inspired by the UI of *Persona 5*.

**Live Demo:** [https://afif25fradana.github.io/Media-Dex/](https://afif25fradana.github.io/Media-Dex/)

## Stack

- Plain HTML5, CSS, and Vanilla JavaScript (ES modules)
- Custom Web Components (`<dex-card>`, `<dex-empty-state>`)
- No frameworks, build tools, or external dependencies

## Running Locally

Because the project uses ES modules and fetches `data.json`, it must be served over HTTP rather than opened directly as a file:

```bash
# Python 3
python -m http.server 3000

# or Node
npx serve .
```

Open `http://localhost:3000` in your browser.
