# MediDesk implementation plan

## Product
MediDesk is a secure care-operations workspace for patients, clinicians, and administrators. The first release uses a Vite React client, an Express API, and Mongoose models ready for MongoDB Atlas.

## Design direction
- **Movement:** calm clinical minimalism with editorial dashboard composition.
- **Principles:** reduce cognitive load, surface next actions, make trust visible, and use generous whitespace.
- **Color philosophy:** deep ink/navy establishes confidence; cobalt provides action focus; mint and amber are reserved for health/status signals; warm white keeps the interface human rather than sterile.
- **Layout:** asymmetrical split hero, persistent dashboard rail, and card clusters that read like a care brief instead of a generic admin grid.
- **Signature elements:** the circular pulse mark, soft blue halo behind primary actions, and “care brief” cards with hairline borders.
- **Interaction:** direct, forgiving, and progressive. Actions give immediate feedback and use plain language.
- **Animation:** short ease-out entrances, subtle hover lift, and no looping motion except the status pulse.
- **Typography:** Inter for UI clarity with Georgia for empathetic display headings.
- **Brand essence:** a secure care-operations layer for modern clinics, built to make every appointment feel considered. Personality: composed, attentive, protective.
- **Voice:** warm, concise, clinically precise. Example lines: “Care that keeps moving.” / “Your next best action, already in view.”
- **Wordmark:** the “M” is paired with a pulse notch inside a rounded square, followed by a measured lower-case wordmark.
- **Signature color:** MediDesk cobalt `#2759d7`.

## Structure
- `src/`: React routes, reusable shell components, client state, and responsive styles.
- `backend/`: Express server, auth middleware, Mongoose models, validation, audit logging, and role-aware routes.
- `public/`: static route manifest and future brand assets.
- `.env.example`: runtime configuration for MongoDB Atlas, JWT, and client origin.
