import { mkdir, writeFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";

const OUT = "public/photos";
const MIN_BYTES = 20_000;

const photos = [
  { name: "coffee-roasted", file: "Roasted_coffee_beans_on_the_surface._01.jpg" },
  { name: "coffee-green", file: "Green_Bean_Coffee.jpg" },
  { name: "coffee-cooling", file: "Cooling_time_for_coffee.jpg" },
  { name: "sourdough-loaf", file: "6312_sourdough_bread.jpg" },
  { name: "sourdough-starter", file: "Sourdough.jpg" },
  { name: "cheese-beaufort", file: "Wheels_of_Beaufort_cheese,_France_(1).jpg" },
  { name: "apples-crate", file: "Mixed_Apples_for_Cider_Pressing.jpg" },
  { name: "lemon-split", file: "Lemon_-_whole_and_split.jpg" },
  { name: "grapes-zinfandel", file: "Ripe_Zinfandel_grapes_in_Dry_Creek_Valley-8958.jpg" },
  { name: "sloe-berries", file: "Closeup_of_blackthorn_aka_sloe_aka_prunus_spinosa_sweden_20050924.jpg" },
  { name: "olives-harvest", file: "Tradizioni_familiari_Raccolta_olive_wlk_olive_in_cassetta.jpg" },
  { name: "honeycomb-frame", file: "Honey_comb_frame_2017.jpg" },
  { name: "chillies-market", file: "Capsicum_baccatum_in_Saúde_flea_market,_São_Paulo,_Brazil.jpg" },
  { name: "spices-dark", file: "Bumbu_dan_Rempah_-_rempah.jpg" },
  { name: "lavender-field", file: "Hitchin_lavender_fields.jpg" },
  { name: "market-stall", file: "Matin_ensoleillé_au_marché_de_la_Terrasse.jpg" },
  { name: "croissant-almond", file: "Almond_croissant_-_Workshop_Coffee_Lab_2025-06-27.jpg" },
  { name: "cacao-pod", file: "20260317_Theobroma_cacao_01.jpg" },
];

async function download({ name, file }) {
  const target = `${OUT}/${name}.jpg`;
  if (existsSync(target) && statSync(target).size >= MIN_BYTES) return "skip";

  const source = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1280`;
  const response = await fetch(source, { headers: { "User-Agent": "KrayaDemo/1.0" }, redirect: "follow" });
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < MIN_BYTES) throw new Error(`${name}: only ${bytes.length} bytes`);
  await writeFile(target, bytes);
  return `${Math.round(bytes.length / 1024)} KB`;
}

await mkdir(OUT, { recursive: true });

for (const photo of photos) {
  try {
    console.log(photo.name.padEnd(20), await download(photo));
  } catch (error) {
    console.error(photo.name.padEnd(20), error.message);
  }
}
