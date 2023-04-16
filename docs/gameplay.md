Items in (parentheses) are speculative possibilities for later development, if we get that far.

The primary forms of interaction in the game will be:
1. Creating trade routes between planets on the map.
2. Placing area effect zones on the map that are crossed by routes.

# Planets

All planets have an HP stat. If the HP hits 0, that planet becomes barren.

By default, every planet produces exactly one good. Some planets may require one or two goods as input in order to produce a good. Planets that take goods as input have a stat for the quantity of that good they possess. That stat has a maximum. If the maximum would be exceeded, spillage of the good produces environmental destruction, represented as loss of HP. Any planet that produces goods may take ship hulls as an input. Note: stockpiles only exist for *input* goods. On the output side, the good doesn't exist until it is put on a ship for delivery.

- Hostile Planets
  Hostile planets produce negative goods. Instead of the player setting up routes, they are created automatically.

- HQ Planet
Gold delivered to the HQ planet determines score and possibly victory. The HQ planet having 0 HP causes defeat. Area effect good must be sent to the HQ planet to be used. It should start the game with enough area effect goods that the player can try out effects. Stockpile limits should be pretty generous; we don't want people overflowing here and losing the game before they understand the mechanics.

- (Lab Planets)
I'm removing this category, which was basically extra places to do area effects from. It doesn't seem necessary.

# Trade Routes

Planets that produce goods may have at most one trade route originating from them. There should be enough route possibilities that choosing route destinations is a meaningful gameplay decision. When a trade route is active goods will arrive at the destination at a rate proportional to the travel time taken by the route, and the hulls available.

## Hostile Routes

## Negative HP
The destination of this route should be chosen based on criteria that are reasonably transparent. The HQ should be a low priority target by default, so 

## (Negative other goods or stats)
Could have planets that steal gold or other goods instead?

# Goods

Goods may be primary (produced directly by worlds) or secondary (produced by worlds that accept primary goods as input)

# Primary Goods

- Gold
  See HQ planet.

- Hull metals
  Produce Ships

- Chronium
  Allows placement of Fast Zones and Slow Zones

Secondary Goods

- Ships (Ship Engines?)
  These are kind of a weird case. Every planet that produces goods has ships. But letting every planet do a ships route seems to make too much micromanagement. So only allowing Ships to be sent from a Ship producing world makes sense. Unlike all of the other goods, however, you wouldn't get your ship back after delivery. If the good is Ship Engines, then we can have it work exactly like other goods, and assume that the receiving planet automatically converts engines to ships. But since every planet can receive engines, it must be possible for a planet that produces engines to use them itself, which is like having a route to itself, which isn't otherwise a thing. I think this should just be a special case.

- (Speedium/Slowium)
  More effective goods that make higher level effects, but are specialized. Or, we could make these primary.

- Pyrite
  Allows placement of Pirate Swarms

- Deuterium
  Allows placement of Nebulae

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
