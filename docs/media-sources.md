# Media source register

This register records third-party media used by the site. Club-supplied media remains
documented separately in the handover and source folders.

## Sports-card action imagery

The following images are custom AI-generated concept assets created with OpenAI ImageGen
on 2026-07-31. They intentionally use generic, unbranded sportswear and close
equipment-led action so the four cards read as one visual set. They are not photographs
of Blackheath players, teams or Rectory Field.

| Sport | Visual direction | Optimised asset |
| --- | --- | --- |
| Cricket | Close batting contact with bat, red ball, pads and stumps | `src/assets/club/cricket-action.webp` |
| Rugby Football | Close ball-carrying action through a tackle | `src/assets/club/rugby-action.webp` |
| Lawn Tennis | Close racket-and-ball contact on a grass court | `src/assets/club/tennis-action.webp` |
| Squash | Close racket-and-ball action inside a traditional court | `src/assets/club/squash-action.webp` |

- Generation model: OpenAI ImageGen.
- Shared direction: photorealistic British community sport, natural light, shallow depth
  of field, tight action crop, plain kit, no logos, sponsors, text or club branding.
- Production files are 1600 x 1100 WebP at quality 84.
- The original club card images remain in `src/assets/club/` for rollback and comparison.

## Replacement guidance

These generated images solve the immediate resolution and consistency problem, but they
must not be presented as documentary photography. Replace them when the club supplies
approved high-resolution action photography.

Preferred replacement files should:

- be at least 2400 px wide, with a landscape composition that supports a 16:11 crop;
- show recognisable match or training action with faces and key equipment in frame;
- include a mix of ages and genders across the four cards where permissions allow;
- have documented photographer credit, usage permission and any required consent;
- avoid sponsor marks or third-party branding that could imply endorsement.
