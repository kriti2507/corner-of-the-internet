import { permanentRedirect } from "next/navigation";

/** Cafés moved to /places, alongside matcha, onsen, gardens and trips. */
export default function CoffeePage() {
  permanentRedirect("/places");
}
