# Platonic Neighbors — Source Notes

This README replaces the inline implementation comments removed from `platonic-neighbors-2d-v9.6.html`. Runtime source is intentionally compact: function arguments and arithmetic expressions stay together instead of being vertically split solely for line length.

## Source organization

The project separates campaign configuration, board generation, domain/game rules, rendering, satellites, chain visualization, particles, audio, statistics, and debug tooling. The separation is intentional: gameplay state is authoritative in the model while Three.js objects are views of that state. Shared rendering resources are reused rather than rebuilt per gem.

## Campaign and board generation

Campaign progression controls board sizes, shapes, palettes, and progressive introduction of hollow variants. Board templates are generated independently from rendering. Hot geometry/layout checks avoid unnecessary square roots when squared distance is sufficient.

The debug chain board records explicit chain identities so requested test-chain lengths remain exact. Neighboring test chains are graph-colored to avoid accidental same-color merges through the game's eight-neighbor connectivity.

## Gameplay model

Solid and hollow forms are incompatible for ordinary matching and prismatic destruction. Shells may terminate a matching chain but are not ordinary interior traversal nodes. Short chains can leave shells, and neighboring explosions can restore them to full gems. Prismatic satellites can be activated independently.

The one-time rescue shuffle is designed to preserve playability when duplicate colors remain and packs the remaining gems into a compact near-square arrangement.

## Rendering and crystal materials

Base gems use shared cached geometry/material resources. Hollow variants use `EdgesGeometry` so the displayed wire form follows the actual Platonic edges without unwanted diagonal wireframe artifacts. Crystal materials implement colored body light, facet highlights, transmission/refraction-like cues, edge response, and configurable appearance controls.

Material-only debug changes update shared resources live instead of rebuilding the board. Base gems rotate independently so facets continue to catch the scene lighting.

## Satellites and orbit synchronization

Satellites use true three-dimensional circular orbits defined by an orthonormal plane basis. Orbital planes remain fixed for a complete revolution and only change after 360 degrees. Plane changes preserve the current radial position and forward tangent so there is no teleport or reversal.

Music BPM controls orbital timing. Audio-spectrum/transient features only modulate temporary visual behavior such as scale, emissive response, shimmer, self-rotation, and trail appearance; they do not directly modify orbital phase. When sound is disabled, a steady fallback clock keeps satellites moving.

Trail lifetime is bounded below one full orbit period so an orbiter cannot catch its own visible trail. Prismatic trails preserve the color emitted at each sample.

## Chain visualization

Hover chains and active chains are separate systems. Hover-chain crisscrossing can be disabled by using a rooted spanning tree, preventing loops back through already traversed gems. Active chains visualize propagation and determine when independent gem effects trigger.

The default active timing matches the v7.1 behavior: sequential triggers are separated by 52 ms and active connector lines remain visible for 360 ms. Electric connectors use exact center-to-center endpoints and regenerate noisy intermediate points to create the animated arc.

## Gem and particle effects

Gem destruction is independent from chain-line rendering. Explosion, halo, crumble, fade, collapse/implosion, pop, and spin/explode modes share common particle infrastructure. Particle count, speed, gravity, size, lifetime, and color can be tuned without duplicating the effect engine.

## Audio architecture

Short WAV assets are discovered, fetched, cached, and decoded for reuse through Web Audio. Background MP3 tracks remain streaming `HTMLAudioElement` media rather than being fully decoded into memory. Missing candidate files are removed from random runtime selection to avoid repeated failed requests.

`AudioAssetCatalog` handles discovery and available-asset lists. `AudioAssetCache` handles short-file caching/decoding. `WebAudioSpritePlayer` provides the effect playback abstraction and supports future consolidation into actual audio sprites. Music selection avoids repeating the immediately previous track when alternatives exist.

## Mobile input and zoom

Mobile gameplay requires landscape orientation, including mobile-sized browser emulation. Touch interaction uses selection first and activation second. Campaign sizing respects the minimum practical rendered/touch target.

Zoom uses `THREE.PerspectiveCamera.zoom` with `updateProjectionMatrix()`. Mouse-wheel and pinch gestures control zoom. Panning is intentionally absent.

## Debug presets

Debug mode is enabled with `?debug=true`. Each section has independently stored preset slots. Presets are persisted in local storage and migrated key by key when loaded by newer builds. A stored property survives only when the current schema still recognizes its type/path and the stored value remains valid for the current control or setting type. Invalid, removed, renamed, or out-of-range values are discarded without invalidating unrelated properties.

The native default configuration is always retained as an available baseline. Material and satellite changes are applied live when possible; structural board or palette changes rebuild only the necessary game state.

## Statistics

Production statistics are persisted in local storage without requiring a server. Debug sessions are excluded from career statistics. Tracked metrics include gems destroyed by Platonic type, moves, chains, chain lengths, attempts, completion times, level scores, fastest completion, and levels played per session. The statistics screen derives aggregate values and correlations from those records.

## Resource management

Temporary Three.js resources, particle meshes, lines, textures, and materials are disposed when their lifetimes end. Shared flyweight resources are not disposed per-instance while other views may still use them. This prevents GPU resource growth across repeated levels and debug rebuilds.

## Formatting convention

The source now follows these rules:

- Calls keep parentheses and ordinary arguments together, e.g. `this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));`.
- Arithmetic and logical operations are kept together, e.g. `speeds[i] = 12 + Math.random() * 36;`.
- Simple assignments and declarations are not vertically expanded solely for line length.
- Callback/block bodies may still span lines because they contain executable blocks rather than a simple parameter list.
- Inline implementation comments have been removed; design and optimization rationale belongs in this README.
## Source formatting

JavaScript formatting is intentionally expression-oriented rather than vertically expanded. Ordinary function calls keep the opening parenthesis, arguments, nested calls, and closing parenthesis together on the same line whenever they form a single expression. Arithmetic, comparison, and logical expressions are likewise kept together rather than breaking immediately after an operator. This applies to nested calls such as `Math.max(8, Math.min(width, value))` and rendering calls such as `geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));`.

Executable block bodies still use normal indentation and line breaks so control flow remains readable. The distinction is that blocks may span lines, while parameter lists and expression fragments are not vertically fragmented.

There are no inline implementation comments in the HTML, CSS, JavaScript, or shader source. Design rationale that previously lived beside the implementation is documented in this README instead.

