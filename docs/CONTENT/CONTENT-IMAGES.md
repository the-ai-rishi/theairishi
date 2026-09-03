# CONTENT IMAGES

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Branding and assets


## Files


- public/brand/logo-horizontal.png — brand.logo. Used as the footer mark (contain, no crop).
- public/brand/logo-mark.png — brand.logoMark. Cinematic poster in the hero (object-contain, no crop).
- public/brand/logo.png — extra lockup on disk.
- public/brand/og-image.jpg — brand.ogImage for Open Graph / Twitter.
- app/icon.png — Next.js favicon (brand.faviconUrl /icon.png). Do not treat public/brand as the favicon.
- app/apple-icon.png — apple touch icon.

Do not modify brand PNG/JPG bytes in public/brand or app/icon.png unless replacing the asset as a whole.

## How they display


Header lockup is typeset (the name in Instrument Serif), not the horizontal PNG. Footer uses the image mark with object-contain. Hero uses the cinematic mark with object-contain. Never crop.

## Copy and paths


brand.* and copy.* in platform.json. After replacing a file, keep the JSON path matching the filename.

## COMPLETE EXAMPLE


# Branding and assets


## Files


- public/brand/logo-horizontal.png — brand.logo. Used as the footer mark (contain, no crop).
- public/brand/logo-mark.png — brand.logoMark. Cinematic poster in the hero (object-contain, no crop).
- public/brand/logo.png — extra lockup on disk.
- public/brand/og-image.jpg — brand.ogImage for Open Graph / Twitter.
- app/icon.png — Next.js favicon (brand.faviconUrl /icon.png). Do not treat public/brand as the favicon.
- app/apple-icon.png — apple touch icon.

Do not modify brand PNG/JPG bytes in public/brand or app/icon.png unless replacing the asset as a whole.

## How they display


Header lockup is typeset (the name in Instrument Serif), not the horizontal PNG. Footer uses the image mark with object-contain. Hero uses the cinematic mark with object-contain. Never crop.

## Copy and paths


brand.* and copy.* in platform.json. After replacing a file, keep the JSON path matching the filename.

## VALIDATION


See OPERATIONS/VALIDATION.md. Run the validate script, open the route, search if public.

## COMMON MISTAKES


Do not invent YouTube or Instagram items. Do not crop brand PNG or JPG. Do not reintroduce switch(section.id). Do not leak coming-soon in the public UI. There is no Python content.

## TROUBLESHOOTING


| Symptom | Cause | Fix |
| --- | --- | --- |
| Route 404 | type or topic not enabled+active with content | keep it hidden or add real content |
| Missing homepage block | showWhenEmpty false and empty | add content or leave hidden |
| validate fails | active course with 0 lessons | set status coming-soon or add lessons |

## HOW TO UNDO


Restore the JSON or markdown files with git restore, or git revert the commit. Do not force-push.
