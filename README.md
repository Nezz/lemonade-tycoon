# Lemonade Tycoon

A business simulation game where you run a lemonade stand, built with **Expo** (React Native) and **Unity**.

Built in ~24 hours (with almost 8 hours of sleep!) for the **Supercell AI Hackathon**.

Don't like reading? Here's a [video](https://www.youtube.com/watch?v=3ogn8hEUPYs) of the game in action.

Don't have time to watch a video? Just play the game [here](https://lemonade-tycoon.vercel.app/)!

## The Game

You start with a small lemonade stand and a dream. Buy supplies, tweak your recipe, set your price, and watch the customers roll in - or not. Weather changes, random events shake things up, and your reputation follows you from day to day. Earn enough to upgrade from a humble sidewalk stand all the way to a Supercell Superstore.

### Gameplay Loop

1. **Plan your day** - Check the weather forecast, buy supplies, adjust your recipe and price
2. **Simulate** - Watch your stand in action as customers come and go
3. **Review results** - See your sales, profit, and reputation changes
4. **Upgrade** - Invest in your stand, unlock new tiers, and grow your empire

### Features

- **Dynamic weather system** - 6 weather types that affect demand and ideal recipes, with upgrades that enable to forecast the weather more accurately
- **39 events** - 23 planned events (heat waves, festivals, lemon shortages) and 16 surprise events (health inspectors, celebrity sightings, power outages)
- **110 upgrades** across 7 tiers - from Sidewalk to Supercell Superstore
- **50+ achievements** - milestones, challenges, and some silly ones. FYI: 50+ is corporate speak for 45.
- **Inventory management** - ice melts, lemons go bad, fridges malfunction
- **Reputation system** - your track record affects future demand. Once you go viral, you can sell an empty cup for $5 and get 100% satisfaction.
- **3D lemonade stand** - Unity renders your stand and upgrades in real-time on iOS/Android
- **Pixel-art UI** - retro aesthetic powered by images less than a kilobyte
- **Auto-save** - pick up where you left off, but don't turn off your console while the game is saving!

## Tech Stack

| Layer        | Tech                            |
| ------------ | ------------------------------- |
| Framework    | Expo 54 / React Native 0.81     |
| Language     | TypeScript (strict)             |
| Routing      | Expo Router (file-system based) |
| State        | Zustand                         |
| 3D Visuals   | Unity (via custom Expo module)  |
| Styling      | Pixel-art theme, VT323 font     |
| Optimization | React Compiler                  |
| Platforms    | iOS, Android, Web               |

## Unity Integration

The 3D lemonade stand is rendered by Unity and embedded as a native view on iOS and Android. React Native sends upgrade data to Unity so the stand visually evolves as you progress. The Unity project lives in a separate repo:
[Nezz/lemonade-tycoon-unity](https://github.com/Nezz/lemonade-tycoon-unity)

## Getting Started

```bash
# Install dependencies
bun install

# Start the dev server
bun start

# Run on device
bun ios        # or bun android if you dare
```

## Author

**Adam Kapos** - [LinkedIn](https://www.linkedin.com/in/adamkapos/)
