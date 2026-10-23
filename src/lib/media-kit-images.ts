/* Media kit art lookup. Pages name their image (e.g. 'setor-03-gastronomia'); any file
   dropped in assets/images/media-kit/ with that name is picked up on the next build.
   Until then a page falls back to a real site photo, or renders as a typographic page. */
import dreamCar from '../assets/images/dream-car-event.webp';
import fleetSaoRoque from '../assets/images/fleet-formation-saoroque.jpg';
import trackday from '../assets/images/track-day-cornering.jpg';
import aventador from '../assets/images/lambo-forest-aventador.jpg';
import founder from '../assets/images/founder-jose-silva.jpg';

const art = import.meta.glob<{ default: ImageMetadata }>('../assets/images/media-kit/*.{jpg,jpeg,png,webp}', {
  eager: true,
});
const byName = new Map(
  Object.entries(art).map(([path, mod]) => [path.split('/').pop()!.replace(/\.[^.]+$/, ''), mod.default]),
);

const sitePhotos: Record<string, ImageMetadata> = {
  'dream-car-event': dreamCar,
  'fleet-formation-saoroque': fleetSaoRoque,
  'track-day-cornering': trackday,
  'lambo-forest-aventador': aventador,
  'founder-jose-silva': founder,
};

export function resolveImage(name?: string, fallback?: string): ImageMetadata | undefined {
  return (name && byName.get(name)) || (fallback ? sitePhotos[fallback] : undefined);
}

/** Responsive widths capped at the source size (sharp never upscales). */
export const widthsFor = (img: ImageMetadata, steps = [768, 1280, 1920]) =>
  [...steps.filter((w) => w < img.width), img.width];
