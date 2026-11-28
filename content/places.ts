/**
 * Places from Kriti's Google Maps lists: onsen, gardens and trips.
 * Every entry is a real place she saved as visited.
 *
 * Cafés and matcha live in the Coffee Notebook (coffee/content/places/), so
 * they aren't repeated here. Their old /places/<slug> links redirect there
 * (see COFFEE_PLACE_SLUGS in next.config.ts).
 *
 * - myNote: true means `note` is her own note from Maps (lightly edited).
 *   false means it is a plain description, so the page doesn't quote it.
 * - lat/lng come from the Maps link and are approximate (city-level). They only place a pin.
 * - To add a place: copy an entry, give it a new slug, and paste the Maps link into mapUrl.
 */

export type PlaceKind = "onsen" | "park" | "trip";

export type Place = {
  slug: string;
  name: string;
  kind: PlaceKind;
  /** Neighbourhood or town. Same as region when only the city is known. */
  area: string;
  /** Tokyo, Hokkaido, Okinawa, Kyoto, Tohoku… */
  region: string;
  note: string;
  myNote: boolean;
  tags: string[];
  lat: number;
  lng: number;
  mapUrl: string;
};

export const PLACE_KINDS: { id: PlaceKind; label: string; plural: string }[] = [
  { id: "onsen", label: "Onsen", plural: "Onsen" },
  { id: "park", label: "Garden", plural: "Parks & gardens" },
  { id: "trip", label: "Trip", plural: "Trips" },
];

export const places: Place[] = [
  {
    slug: "kabe-onsen-ume-no-yu",
    name: "Kabe Onsen Ume no Yu",
    kind: "onsen",
    area: "Ōme",
    region: "Tokyo",
    note: "A hot spring out west in Ōme, near the Okutama trails.",
    myNote: false,
    tags: ["after-a-hike"],
    lat: 35.785,
    lng: 139.285,
    mapUrl: "https://www.google.com/maps/place/Kabe+Onsen+Ume+no+Yu+Hot+Spring/data=!4m2!3m1!1s0x601926aabc274c71:0xc5ecb162c490e70b",
  },
  {
    slug: "fukiage-onsen",
    name: "Fukiage Open-air Onsen",
    kind: "onsen",
    area: "Kamifurano",
    region: "Hokkaido",
    note: "A free outdoor bath in the mountains below Tokachidake.",
    myNote: false,
    tags: ["outdoor"],
    lat: 43.43,
    lng: 142.637,
    mapUrl: "https://www.google.com/maps/place/Fukiage+open-air+Onsen/data=!4m2!3m1!1s0x5f7334f9f144f417:0xeee09ab0527fb793",
  },
  {
    slug: "kura-no-yu-naebo",
    name: "Kura no Yu",
    kind: "onsen",
    area: "Naebo",
    region: "Hokkaido",
    note: "A hot spring right by Naebo Station.",
    myNote: false,
    tags: [],
    lat: 43.068,
    lng: 141.377,
    mapUrl: "https://www.google.com/maps/place/Naebo+Station+Onsen+Kura+no+Yu/data=!4m2!3m1!1s0x5f0b2966129ff395:0x376c207656b834a",
  },
  {
    slug: "hana-yuzuki",
    name: "Hana Yuzuki",
    kind: "onsen",
    area: "Sapporo",
    region: "Hokkaido",
    note: "A hot spring in Sapporo.",
    myNote: false,
    tags: [],
    lat: 43.077,
    lng: 141.316,
    mapUrl: "https://www.google.com/maps/place/Yudokoro+Hana+Yuzuki/data=!4m2!3m1!1s0x5f0b2852e93ac593:0x559fa5ce2cd19ac8",
  },
  {
    slug: "shinjuku-gyoen",
    name: "Shinjuku Gyoen",
    kind: "park",
    area: "Shinjuku",
    region: "Tokyo",
    note: "The big garden in the middle of the city.",
    myNote: false,
    tags: [],
    lat: 35.687,
    lng: 139.711,
    mapUrl: "https://www.google.com/maps/place/Shinjuku+Gyoen+National+Garden/data=!4m2!3m1!1s0x60188cc21b93233f:0x6a1eb1b5a117f287",
  },
  {
    slug: "hamarikyu-gardens",
    name: "Hamarikyū Gardens",
    kind: "park",
    area: "Shiodome",
    region: "Tokyo",
    note: "A tidal garden under the towers.",
    myNote: false,
    tags: [],
    lat: 35.663,
    lng: 139.763,
    mapUrl: "https://www.google.com/maps/place/Hamariky%C5%AB+Gardens/data=!4m2!3m1!1s0x60188bdcbaa0f7c1:0x9b4a9ebdf898381a",
  },
  {
    slug: "kyu-shiba-rikyu",
    name: "Kyu-Shiba-rikyū Gardens",
    kind: "park",
    area: "Hamamatsuchō",
    region: "Tokyo",
    note: "A small, quiet garden by the station.",
    myNote: false,
    tags: [],
    lat: 35.655,
    lng: 139.759,
    mapUrl: "https://www.google.com/maps/place/Kyu-Shiba-riky%C5%AB+Gardens/data=!4m2!3m1!1s0x60188bcf43836d75:0xa24f998b1e39dd74",
  },
  {
    slug: "meguro-sky-garden",
    name: "Meguro Sky Garden",
    kind: "park",
    area: "Meguro",
    region: "Tokyo",
    note: "A garden on top of a highway junction.",
    myNote: false,
    tags: [],
    lat: 35.651,
    lng: 139.688,
    mapUrl: "https://www.google.com/maps/place/Meguro+Sky+Garden/data=!4m2!3m1!1s0x6018f4abbe170ab3:0x49b378992a0735fb",
  },
  {
    slug: "jomyoin",
    name: "Jōmyōin",
    kind: "park",
    area: "Yanaka",
    region: "Tokyo",
    note: "Pretty lights at night during Obon.",
    myNote: true,
    tags: ["temple"],
    lat: 35.722,
    lng: 139.773,
    mapUrl: "https://www.google.com/maps/place/Jomyoin/data=!4m2!3m1!1s0x60188e81dc1ba045:0xb7bca5894fec6afa",
  },
  {
    slug: "akitaya-takahashi-farm",
    name: "Akitaya Takahashi Farm",
    kind: "park",
    area: "Yoichi",
    region: "Hokkaido",
    note: "Amazing sakura, and no people.",
    myNote: true,
    tags: ["sakura"],
    lat: 43.175,
    lng: 140.994,
    mapUrl: "https://www.google.com/maps/place/%E7%A7%8B%E7%94%B0%E5%B1%8B%E9%AB%98%E6%A9%8B%E8%BE%B2%E5%9C%92/data=!4m2!3m1!1s0x5f0ae092e23eed49:0xf2113347a13a3b7c",
  },
  {
    slug: "hirosaki-park",
    name: "Hirosaki Park",
    kind: "park",
    area: "Hirosaki",
    region: "Tohoku",
    note: "The castle park in Hirosaki.",
    myNote: false,
    tags: ["castle"],
    lat: 40.607,
    lng: 140.464,
    mapUrl: "https://www.google.com/maps/place/Hirosaki+Park/data=!4m2!3m1!1s0x5f9b01c41b4b1d49:0x1b2b7530b0ff15fc",
  },
  {
    slug: "farm-tomita",
    name: "Farm Tomita",
    kind: "park",
    area: "Furano",
    region: "Hokkaido",
    note: "The lavender fields in Furano.",
    myNote: false,
    tags: ["flowers"],
    lat: 43.403,
    lng: 142.423,
    mapUrl: "https://www.google.com/maps/place/Farm+Tomita/data=!4m2!3m1!1s0x5f0cb35dd4163777:0xb76dcf0287606d92",
  },
  {
    slug: "uegusuku-castle-ruins",
    name: "Uegusuku Castle Ruins",
    kind: "trip",
    area: "Kumejima",
    region: "Okinawa",
    note: "The highest point on the island. Nice breeze and a view.",
    myNote: true,
    tags: ["view"],
    lat: 26.37,
    lng: 126.77,
    mapUrl: "https://www.google.com/maps/place/Uegusuku+Castle+Ruins/data=!4m2!3m1!1s0x34fa84c541209c69:0x8643548654c2ddf0",
  },
  {
    slug: "kouri-bridge",
    name: "Kouri Bridge",
    kind: "trip",
    area: "Kouri Island",
    region: "Okinawa",
    note: "Incredible sea views.",
    myNote: true,
    tags: ["sea", "view"],
    lat: 26.722,
    lng: 128.033,
    mapUrl: "https://www.google.com/maps/place/Kouri+Big+Bridge/data=!4m2!3m1!1s0x34e4590844052dcb:0x67752f9f2eedfc21",
  },
  {
    slug: "tunnaha-forest-park",
    name: "Tunnaha Forest Park",
    kind: "trip",
    area: "Kumejima",
    region: "Okinawa",
    note: "Very calm, with a beautiful view.",
    myNote: true,
    tags: ["view"],
    lat: 26.347,
    lng: 126.803,
    mapUrl: "https://www.google.com/maps/place/Tunnaha+Forest+park/data=!4m2!3m1!1s0x34fa9b41c2bdd259:0xaf35c4bf68023dd5",
  },
  {
    slug: "shirogane-blue-pond",
    name: "Shirogane Blue Pond",
    kind: "trip",
    area: "Biei",
    region: "Hokkaido",
    note: "The blue pond outside Biei.",
    myNote: false,
    tags: [],
    lat: 43.5,
    lng: 142.61,
    mapUrl: "https://www.google.com/maps/place/Shirogane+Blue+Pond+(Aoiike)/data=!4m2!3m1!1s0x5f0ccc62de222a6f:0x4cd181f9f4b779e",
  },
  {
    slug: "unkai-terrace-tomamu",
    name: "Unkai Terrace",
    kind: "trip",
    area: "Tomamu",
    region: "Hokkaido",
    note: "A terrace above Tomamu for the sea of clouds.",
    myNote: false,
    tags: ["view"],
    lat: 43.077,
    lng: 142.599,
    mapUrl: "https://www.google.com/maps/place/Hoshino+Resorts+Tomamu+Unkai+Terrace/data=!4m2!3m1!1s0x5f736120eb89915f:0xc3bf447ff8ae39ff",
  },
  {
    slug: "cape-sukoton",
    name: "Cape Sukoton",
    kind: "trip",
    area: "Rebun Island",
    region: "Hokkaido",
    note: "The northern tip of Rebun. A good cape.",
    myNote: true,
    tags: ["sea"],
    lat: 45.406,
    lng: 141.006,
    mapUrl: "https://www.google.com/maps/place/Cape+Sukoton/data=!4m2!3m1!1s0x5f0ff006c417c09f:0x66385f860fa849e0",
  },
  {
    slug: "fushimi-inari",
    name: "Fushimi Inari Taisha",
    kind: "trip",
    area: "Fushimi",
    region: "Kyoto",
    note: "The thousand torii.",
    myNote: false,
    tags: ["shrine"],
    lat: 34.967,
    lng: 135.772,
    mapUrl: "https://www.google.com/maps/place/Fushimi+Inari+Taisha/data=!4m2!3m1!1s0x60010f153d2e6d21:0x7b1aca1c753ae2e9",
  },
  {
    slug: "teamlab-borderless",
    name: "teamLab Borderless",
    kind: "trip",
    area: "Azabudai Hills",
    region: "Tokyo",
    note: "Rooms of light, next door to work.",
    myNote: false,
    tags: ["museum"],
    lat: 35.626,
    lng: 139.783,
    mapUrl: "https://www.google.com/maps/place/teamLab+Borderless:+MORI+Building+DIGITAL+ART+MUSEUM/data=!4m2!3m1!1s0x601889fad49a9443:0x5831aba3288d2651",
  },
  {
    slug: "jimbocho-book-town",
    name: "Jimbōchō Book Town",
    kind: "trip",
    area: "Jimbōchō",
    region: "Tokyo",
    note: "Streets of second-hand bookshops.",
    myNote: false,
    tags: ["books"],
    lat: 35.727,
    lng: 139.762,
    mapUrl: "https://www.google.com/maps/place/Jimbocho+Book+Town/data=!4m2!3m1!1s0x60188dce2211f995:0xe22eeafa479cd390",
  },
];

const KIND_TAG: Record<PlaceKind, string> = { onsen: "onsen", park: "garden", trip: "trip" };

/** Places with their kind and region added as tags, so /tags/tokyo or /tags/onsen can list them. */
export function getPlaces(): Place[] {
  return places.map((place) => ({
    ...place,
    tags: [...new Set([KIND_TAG[place.kind], place.region.toLowerCase(), ...place.tags])],
  }));
}

export function getPlace(slug: string) {
  return getPlaces().find((place) => place.slug === slug) ?? null;
}

export function kindLabel(kind: PlaceKind) {
  return PLACE_KINDS.find((item) => item.id === kind)?.label ?? kind;
}

/** "Ginza, Tokyo" — or just "Tokyo" when the neighbourhood isn't known. */
export function placeWhere(place: Pick<Place, "area" | "region">) {
  return place.area === place.region ? place.region : `${place.area}, ${place.region}`;
}
