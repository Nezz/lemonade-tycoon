import type { WeatherType, DayResult, ActiveEvent } from "@/engine/types";

// ── Weather-to-scene descriptors ─────────────────────────────────────────────

const WEATHER_SCENE: Record<WeatherType, string> = {
  hot: "blazing hot summer day, intense golden sunlight, shimmering heat haze rising from the pavement, deep blue cloudless sky, people in tank tops and sunglasses",
  sunny:
    "bright sunny day, warm golden afternoon light, clear blue sky with a few white clouds, gentle breeze rustling the leaves, people in summer clothes",
  warm: "pleasant warm day, soft sunlight filtering through scattered clouds, green leafy trees swaying gently, comfortable spring atmosphere",
  cloudy:
    "overcast cloudy day, muted diffused light, grey sky with layers of clouds, cool breeze, people in light jackets",
  rainy:
    "rainy day, steady rain falling, puddles forming on the sidewalk, people with umbrellas hurrying past, wet glistening surfaces, grey sky",
  stormy:
    "stormy day, dark dramatic clouds, heavy rain and wind, lightning flashes in the distance, dramatic moody lighting, few people braving the weather",
};

const WEATHER_LIGHTING: Record<WeatherType, string> = {
  hot: "harsh bright sunlight with deep shadows",
  sunny: "warm golden hour lighting",
  warm: "soft natural daylight",
  cloudy: "flat diffused grey light",
  rainy: "dim grey light with reflections on wet surfaces",
  stormy: "dark dramatic lightning-tinged light",
};

// ── Base scene (shared across all prompts) ───────────────────────────────────

const BASE_SCENE =
  "a charming wooden lemonade stand on a suburban sidewalk, hand-painted sign reading LEMONADE, pitchers of yellow lemonade, stacked paper cups, lemons on display, green leafy trees in the background, residential neighborhood";

// ── Prompt builders ──────────────────────────────────────────────────────────

/** Opening prompt — sets the scene based on weather and context. */
export function buildOpeningPrompt(result: DayResult): string {
  const weather = WEATHER_SCENE[result.weather];
  const lighting = WEATHER_LIGHTING[result.weather];

  return `${BASE_SCENE}, ${weather}, ${lighting}, early morning setup, the stand is being prepared for the day, lemons being arranged, pitchers being filled, a quiet street about to come alive, camera slowly pushing in toward the stand, wide establishing shot`;
}

/** Selling period prompt — customers arriving and buying lemonade. */
export function buildSellingPrompt(result: DayResult): string {
  const weather = WEATHER_SCENE[result.weather];
  const lighting = WEATHER_LIGHTING[result.weather];
  const busy = result.cupsSold > 20;
  const crowd = busy
    ? "a long line of eager customers queuing at the stand, busy bustling atmosphere, multiple people drinking lemonade"
    : "a few customers approaching the stand, a person paying for a cup of lemonade, friendly casual atmosphere";

  return `${BASE_SCENE}, ${weather}, ${lighting}, ${crowd}, cups of lemonade being poured and served, money changing hands, cheerful neighborhood scene, camera at medium distance showing the activity around the stand`;
}

/** Surprise event prompt — modifies the scene based on an event. */
export function buildEventPrompt(
  event: ActiveEvent,
  weather: WeatherType,
): string {
  const lighting = WEATHER_LIGHTING[weather];
  const eventScene = getEventScene(event.id);

  return `${BASE_SCENE}, ${lighting}, ${eventScene}, camera at medium distance capturing the moment`;
}

/** Closing prompt — end of the day. */
export function buildClosingPrompt(result: DayResult): string {
  const successful = result.cupsSold > 15;
  const ending = successful
    ? "the stand owner happily cleaning up, empty pitchers, satisfied smile, golden sunset light warming the scene, a successful day ending"
    : "the stand being quietly packed up, some leftover lemonade, subdued atmosphere, late afternoon shadows growing longer";

  return `${BASE_SCENE}, late afternoon golden hour sunset light, long warm shadows, ${ending}, camera slowly pulling back from the stand, peaceful end-of-day atmosphere`;
}

/** Sold out prompt — stand ran out of stock. */
export function buildSoldOutPrompt(result: DayResult): string {
  const weather = WEATHER_SCENE[result.weather];

  return `${BASE_SCENE}, ${weather}, the stand has a hand-written SOLD OUT sign hanging from it, empty pitchers, no more cups, a few disappointed customers walking away, the stand owner looking proud but apologetic, camera at medium distance`;
}

// ── Event scene descriptions ─────────────────────────────────────────────────

function getEventScene(eventId: string): string {
  switch (eventId) {
    case "heatWave":
      return "extreme heat, people fanning themselves, heat shimmer visible, everyone desperately thirsty, huge line at the stand";
    case "streetFair":
      return "colorful street fair decorations, bunting and banners, other vendor stalls nearby, festive crowded atmosphere";
    case "construction":
      return "construction barriers and orange cones blocking part of the sidewalk, construction workers in hard hats nearby, jackhammer noise";
    case "schoolFieldTrip":
      return "a group of excited school children in matching t-shirts approaching the stand with a teacher, backpacks and laughter";
    case "competingStand":
      return "a rival lemonade stand visible across the street, competition signs, two stands facing off";
    case "newspaperFeature":
      return "a newspaper reporter with a camera taking photos of the stand, flash going off, the stand looking its best";
    case "healthInspector":
      return "a person in business attire with a clipboard inspecting the stand closely, stern expression, official-looking";
    case "celebritySighting":
      return "a glamorous celebrity with sunglasses stopping at the stand, paparazzi cameras flashing, excited crowd gathering";
    case "powerOutage":
      return "the street looks slightly different, some shop lights are off, a more subdued atmosphere than usual";
    case "touristBus":
      return "a large tour bus parked nearby, tourists with cameras flooding toward the stand, excited foreign visitors";
    case "viralVideo":
      return "someone holding up a phone recording the stand, social media excitement, a small crowd forming to see what is going on";
    case "foodBlogReview":
      return "a food blogger with a fancy camera photographing the lemonade, artistically arranging the cup for a photo";
    default:
      return "something unusual happening near the lemonade stand, curious onlookers gathering";
  }
}
