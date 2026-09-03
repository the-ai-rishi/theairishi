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
