# Code Review Guidelines for IGNITE SPORTS CLUB

Please review pull requests for this repository with the following priorities:

1. **Safety & Stability**:
   - Check for runtime errors, uncaught promises, or undefined property access.
   - For Three.js / React Three Fiber (`@react-three/fiber`, `@react-three/drei`, `three`), verify proper resource disposal (geometries, materials, textures) and animation frame cleanup to prevent GPU/memory leaks.
   - Ensure event listeners and timers (GSAP / window listeners) are cleaned up in React `useEffect` hooks.

2. **TypeScript & Build Integrity**:
   - Ensure TypeScript strict typing without unnecessary `any` casts.
   - Code must pass `tsc -b` and Vite production bundling.

3. **Performance & Responsiveness**:
   - Verify that heavy animations or 3D canvas operations degrade gracefully on mobile screens.
   - Avoid blocking main thread operations during user interactions or route transitions.

4. **Security**:
   - Never commit API keys, secrets, or sensitive credentials.
   - Prevent XSS when rendering dynamic HTML or external inputs.

5. **Style & Non-blocking Advisory**:
   - Keep feedback concise, actionable, and construct suggestions with clear code snippets.
   - Focus on genuine bugs, regressions, or architectural concerns.
