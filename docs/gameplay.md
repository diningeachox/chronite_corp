Items in (parentheses) are speculative possibilities for later development, if we get that far.

The primary forms of interaction in the game will be:
1. Creating trade routes between planets on the map.
2. Placing area effect zones on the map that are crossed by routes.

# Planets

All planets have an HP stat. If the HP hits 0, that planet becomes barren and has no effect for the rest of the game. Ships sent from a planet continue to their destination to drop off their cargoes, but then disappear.

Every planet except the HQ makes exactly one product, which may be a resource, an engine type, a module type, or warships. Some planets may require one or two resources as inputs in order to produce a good. Planets that take resources as input have a stat for the quantity of that resource in their stockpiles. That stat has a maximum. If the maximum would be exceeded, spillage of the good produces environmental destruction, represented as loss of HP. Note: stockpiles only exist for *input* goods. On the output side, the good doesn't exist until it is put on a ship for delivery.

Any non-hostile planet that produces goods may be sent engines. 
You may also send modules to non-hostile planets.

- Hostile Planets
  Hostile planets produce warships. Instead of the player setting up routes, they are created automatically, preferring planets that are nearby and have lower HP. You may only send your own warships to hostile planets, not engines, resources, or modules.

- HQ Planet
Gold delivered to the HQ planet determines score and possibly victory. The HQ planet having 0 HP causes defeat. Area effect resources must be sent to the HQ planet to be used. It starts with some Hyperchronite, but no other resources. It has no input maxima. It has twice the HP of other planets.


# Starting Planets

1. HQ. Takes Metacrystals (was Gold) and all area effect resources as inputs. (Hyperchronite, Infrachronite, Deuterium, and Pyrite.)

2. Produces Antimatter. No inputs. Starts with a route to 3.

3. Sends Basic Engines. Takes Antimatter as an input. Engines cannot be sent here; domestic production must be used to get more ships.

4. Produces Hyperchronite (was Speedium.) No inputs.

5. Produces Computronium. No inputs.

6. Sends Scouts. Takes Computronium as an input.

7. Produces Infrachronite. (was Slowium.)

8. Produces Metacrystals Takes Computronium and Hyperchronite as inputs. Has low input maxes.

# Initially Unexplored Planets

First Tier. Exploration will randomly pick one of the non hostile planets within a tier. Hostile planets within a tier will revealed at the same time that 

9. Produces Deuterium. No inputs.

10. Produces Pyrite. No inputs.

11. Sends Cutter Engines. Takes Hyperchronite and Basic Engines as inputs. Engines sent here are *inputs*, they cannot be sent to be used as ships; domestic production must be used to get more ships. Has Cutter ships.

12. Sends Heavy Engines. Takes Infrachronite and Basic Engines as inputs. Engines sent here are *inputs*, they cannot be sent to be used as ships; domestic production must be used to get more ships. Has Heavy ships.

13. Hostile Military Planet I. Sends Warships.

Second Tier

14. Military Planet. Sends Warships. Takes Antimatter as an input.

15. Sends Construction Modules. Takes Computronium as input.

16. Produces Selectable Resource. (Resource can be selected in the planet's info panel, and can be Hyperchronite or Infrachronite.)

17. Produces Selectable Resource. (Resource can be selected in the planet's info panel, and can be Deuterium or Pyrite.)

18. Produces Metacrystals. Takes Pyrite and Deuterium as inputs.

19. Hostile military planet II. Sends either Cutter or Heavy Warships. (Determined randomly when revealed.)

Third Tier

20. Sends Restoration Modules. Takes Infrachronite and Computronium as input.

21. Produces Selectable Resource. (Resource can be selected in the planet's info panel, and can be Antimatter or Computronium.)

22. Military Planet II. Sends Warships. Takes Antimatter as an input.

23. Grand Bazaar. Takes every Basic resource. (They all feed into the same input stat.) Produces Metacrystals.

N. Hostile military planet III. Sends all three kinds of warships.

# Trade Routes

Planets that produce goods may have at most one trade route originating from them. There should be enough route possibilities that choosing route destinations is a meaningful gameplay decision. When a trade route is active goods will arrive at the destination at a rate proportional to the travel time taken by the route, and the hulls available.

## Hostile Routes

## Negative HP
The destination of this route should be chosen based on criteria that are reasonably transparent. The HQ should be a low priority target by default, so 


# Resources

Basic resources are produced directly by planets. Engines, modules, 

# Basic Resources

- Antimatter

- Computronium

- Infrachronite
  Allows placement of Slow Zones

- Hyperchronite
  Allows placement of Fast Zones

- Pyrite
  Allows placement of Pirate Swarms

- Deuterium
  Allows placement of Nebulae


- Metacrystals
  Metacrystals that have been shipped to the HQ Planet determine victory.

# Engines

M

- Ships (Ship Engines?)
  Every planet that produces goods has ships. By default, they are basic ships. When a route is begun, ships are sent out
  
  So only allowing Ships to be sent from a Ship producing world makes sense. Unlike all of the other goods, however, you wouldn't get your ship back after delivery. If the good is Ship Engines, then we can have it work exactly like other goods, and assume that the receiving planet automatically converts engines to ships. But since every planet can receive engines, it must be possible for a planet that produces engines to use them itself, which is like having a route to itself, which isn't otherwise a thing. I think this should just be a special case.



- (Nullium)
  Allows placement of Calming Zone. Should be rare.



# Area Effects

These can be generally be placed anywhere on the map. They are circular (or roughly, depending on map granularity) They cannot be placed where they would overlap with other area effects. (?)Placing area effects should be the main focus of gameplay.

- Fast Zone / Slow Zone
  Speeds up or slows down routes passing through them.

- Nebulae
  Reduces volume of routes over a speed threshold.

- Pirate Swarm
  Reduces volume of routes under a speed threshold.

- (Calming Zone)
This effect is an exception to the no-overlapping effect rule, as its purpose is to erase other area effects.

# Events

Any area effect may spontaneously be created at random. Hostile planets may appear. (Or unexplored worlds or barren worlds may turn into hostiles.)
