# Sweeties Magazine Flipbook

A standalone, responsive magazine reader for Sweeties Magazine Issue 001.

## Install in the Jahntella repository

1. Extract the ZIP.
2. Copy the entire `sweeties-magazine` folder into the repository root.
3. Commit and deploy.
4. Open `/sweeties-magazine/` on the live site.

To add a homepage link, place this wherever you want the magazine button:

```html
<a href="sweeties-magazine/" class="sweeties-magazine-link">Read Sweeties Magazine ♡</a>
```

Optional styling:

```css
.sweeties-magazine-link {
  display: inline-flex;
  padding: .9rem 1.25rem;
  border: 1px solid #ff8bd2;
  border-radius: 999px;
  color: white;
  background: #ff2fa7;
  text-decoration: none;
  font-weight: 800;
  box-shadow: 0 0 18px rgba(255,47,167,.65);
}
```

## Reader features

- Heart-shaped previous and next controls
- Smooth page-turn transition
- Mobile swipe support
- Keyboard arrows, Home, End, and Space
- Page slider and page dots
- Fullscreen mode
- Responsive portrait-page presentation
- No outside libraries or plugins
