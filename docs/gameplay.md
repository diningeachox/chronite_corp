Items in (parentheses) are speculative possibilities for later development, if we get that far.

The primary forms of interaction in the game will be:
1. Creating trade routes between planets on the map.
2. Placing area effect zones on the map that are crossed by routes.

# Planets

All planets have an HP stat. If the HP hits 0, that planet becomes barren and has no effect for the rest of the game. Ships sent from a planet continue to their destination to drop off their cargoes, but then disappear.

Every planet except the HQ makes exactly one product, which may be a resource, an engine type, a module type, or warships. Some planets may require one or two resources as inputs in order to produce a good. Planets that take resources as input have a stat for the quantity of that resource in their stockpiles. That stat has a maximum. If the maximum would be exceeded, spillage of the good produces environmental destruction, represented as loss of HP. Note: stockpiles only exist for *input* goods. On the output side, the good doesn't exist until it is put on a ship for delivery.

Any non-hostile planet that produces goods may be sent engines. 
You may also send modules to non-hostile planets.

## Hostile Planets
  Hostile planets produce Munitions. Instead of the player setting up routes, they are created automatically, preferring planets that are nearby and have lower HP. You may only send your own warships to hostile planets, not engines, resources, or modules. Hostile planets will be revealed either when triggered by exploration, or when Metacrystal quantities reach certain thresholds.

## HQ Planet
Gold delivered to the HQ planet determines score and possibly victory. The HQ planet having 0 HP causes defeat. Area effect resources must be sent to the HQ planet to be used. It starts with some Hyperchronite, but no other resources. It has no input maxima. It has twice the HP of other planets.


## Starting Planets

1. "Chronite Corporation HQ". Takes Metacrystals (was Gold) and all area effect resources as inputs. (Hyperchronite, Infrachronite, Deuterium, and Pyrite.)

2. "Compact Energetics" Produces Antimatter. No inputs. Starts with a route to 3.

3. "All Cluster Transport" Sends Basic Engines. Takes Antimatter as an input. Engines cannot be sent here; domestic production must be used to get more ships.

4. "Everfast City" Produces Hyperchronite (was Speedium.) No inputs.

5. "Petabit Research Labs" Produces Computronium. No inputs.

6. "Polytechnic Explorer's Institute" Sends Scouts. Takes Computronium as an input.

7. "Starset Resort" Produces Infrachronite. (was Slowium.)

8. "Cryptic Vaults" Produces Metacrystals. Takes Computronium and Hyperchronite as inputs. Has low input maxes.

## Initially Unexplored Planets

Unexplored planets have a scouting progress stat which is initially at 0, and increases as Scouts are sent to it. When that stat hits a threshold, the planet is revealed, and may be used as any other planet.

Exploration will randomly pick one of the non hostile planets within a tier. Hostile planets within a tier will be revealed at the same time that one of the last two planets in a tier is revealed.

### First Tier. 

9. "Titanica" Produces Deuterium. No inputs.

10. "New Tortuga" Produces Pyrite. No inputs.

11. "Swift Logistics" Sends Cutter Engines. Takes Hyperchronite and Basic Engines as inputs. Engines sent here are *inputs*, they cannot be sent to be used as ships; domestic production must be used to get more ships. Has Cutter ships.

12. "Masslift Industries" Sends Heavy Engines. Takes Infrachronite and Basic Engines as inputs. Engines sent here are *inputs*, they cannot be sent to be used as ships; domestic production must be used to get more ships. Has Heavy ships.

13. "The Robotic Rebellion" Hostile Military Planet I. Sends Munitions. If it is not revealed by the exploration trigger, it will be revealed when Metacrystals are at 30% of the victory threshold.

### Second Tier

14. "Frontera Base" Military Planet. Sends munitions. Takes Antimatter as an input.

15. "Modular Silo Holdings" Sends Construction Modules. Takes Computronium as input.

16. "Time Whorls" Produces Selectable Resource. (Resource can be selected in the planet's info panel, and can be Hyperchronite or Infrachronite.)

17. "Correctional Mines" Produces Selectable Resource. (Resource can be selected in the planet's info panel, and can be Deuterium or Pyrite.)

18. "The Hidden Exchange" Produces Metacrystals. Takes Pyrite and Deuterium as inputs.

19. "The Formic Nest" Hostile military planet II. Sends Munitions on either Cutter or Heavy ships. (Determined randomly when revealed.) If it is not revealed by the exploration trigger, it will be revealed when Metacrystals are at 50% of the victory threshold.

### Third Tier

20. "Terraseed Nursery" Sends Restoration Modules. Takes Infrachronite and Computronium as input.

21. "Positronic Fabricators" Produces Selectable Resource. (Resource can be selected in the planet's info panel, and can be Antimatter or Computronium.)

22. "Milcorp Fortress" Military Planet II. Sends Munitions. Takes Antimatter as an input.

23. "The Galactic Bazaar". Takes every Basic resource. (They all feed into the same input stat.) Produces Metacrystals.

24. "The Clone Horde" Hostile military planet III. Sends Munitions on all three kinds of ships. If it is not revealed by the exploration trigger, it will be revealed when Metacrystals are at 70% of the victory threshold.

# Trade Routes

Planets that produce resources may have at most one trade route originating from them and arriving at another planet. There is no limit to how many routes may have the same destination.
A ship will be sent on an active route when:
- At least one ship is present in the planet's ship queue.
- All inputs are present in at least the amount of the capacity of the next ship in the queue.
- The cooldown interval has passed since the last ship was sent.

When the ships arrive at the destination planet, they will drop off their cargo into that planet's input stockpile, or affect the destination's stats (if the cargo is a module or munition) or create a ship at the destination (if the cargo is an engine.) Then the ship gates back to the origin planet, and goes to the back of the ship queue. (Order of ships in the queue matters now that we have three distinct kinds of ships.)

Routes may be recalled. If a route is recalled, ships in that route remain in the queue when they return home.

If a new route is created while another route is active, all ships on the previous route must return home before they can use the new route.

# Resources

Basic resources are produced directly by planets. Engines, modules, and metacrystals require other resources to produce.

## Basic Resources

- Antimatter

- Computronium

- Infrachronite
  HQ stockpile allows placement of Slow Zones.

- Hyperchronite
  HQ stockpile allows placement of Fast Zones.

- Pyrite
  HQ stockpile allows placement of Pirate Swarms.

- Deuterium
  HQ stockpile allows placement of Nebulae.

## Metacrystals
  Metacrystals that have been shipped to the HQ Planet determine victory.

## Modules, Munitions, and Scouts
  These do not go into input stockpiles, but affect a planet's stats immediately when they are received.

- Restoration Modules
  Increases HP

- Construction Modules
  Increases Input stockpile Max.

- Munitions
  Decreases HP. These are only sent by Hostile Planets to your planets, or by your planets to Hostile planets.

- Scouts
  These can only be sent to Unexplored Planets. They increase the planet's Scouting Progress stat.   

# Engines and Ships

  Every planet that produces goods has ships. By default, they are basic ships. When a route is begun, ships are sent from the origin at regular intervals. In order to increase the number of ships, you must send engines to that planet. When a planet receives an engine, it immediately becomes a ship at that planet.
  
  Planets that produce ships are the exception. In order to get more ships there, you must use the domestic production interface rather than creating a route.

  Engines have three types:

- Basic engine
  Makes Basic ships

- Cutter engine
  Makes Cutter ships. These are faster than standard ships and have the same capacity.

- Heavy engine
  Makes Heavy Ships, these are slower than standard ships, but have greater capacity.

# Area Effects

These can be generally be placed anywhere on the map. They are circular (or roughly, depending on map granularity) They cannot be placed where they would overlap with other area effects. Placing area effects should be the main focus of gameplay. After a period of time, they decay.

- Fast Zone / Slow Zone
  Speeds up or slows down routes passing through them. On planets: decreases or increases the interval between sending ships.

- Nebulae
  Destroys a proportion of ships over a speed threshold. Note: this includes Cutter ships operating at their default speed. (On planets: ???)

- Pirate Swarm
  Destroys a proportion of ship under a speed threshold. Note: this includes Heavy ships operating at their default speed. (On planets: steals from input stockpiles?) 

# Events

Any area effect may spontaneously be created at random. 
