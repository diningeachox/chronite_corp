Items in (parentheses) are speculative possibilities for later development, if we get that far.

The primary forms of interaction in the game will be:
1. Creating trade routes between planets on the map.
2. Placing area effect zones on the map that are crossed by routes.

#Planets

All planets have an HP stat. If the HP hits 0, that planet becomes barren.

By default, every planet produces exactly one good. Some planets may require one or two goods as input in order to produce a good. Planets that take goods as input have a stat for the quantity of that good they possess. That stat has a maximum. If the maximum would be exceeded, spillage of the good produces environmental destruction, represented as loss of HP. Any planet that produces goods may take hulls as an input.

- Hostile Planets
  Hostile planets produce negative goods. Instead of the player setting up routes, they are created automatically.

- HQ Planet
Gold delivered to the HQ planet determines score and possibly victory. The HQ planet having 0 HP causes defeat.

- (Lab Planets)
These accept resources and allow you to place the corresponding area effects on the map in a zone around them that takes up much of the map. If these aren't used, they can be placed anywhere.

#Trade Routes

Planets that produce goods may have at most one trade route originating from them. There should be enough route possibilities that choosing route destinations is a meaningful gameplay decision. When a trade route is active goods will arrive at the destination at a rate proportional to the travel time taken by the route, and the hulls available.

##Hostile Routes

##Negative HP
The destination of this route should be chosen based on criteria that are reasonably transparent. The HQ should be a low priority target by default, so 

##(Negative other goods or stats)
Could have planets that steal gold instead?

#Goods

Goods may be primary (produced directly by worlds) or secondary (produced by worlds that accept primary goods as input)

#Primary Goods

- Gold
  See HQ planet.

- Hull metals
  Produce hulls

- Hulls
  Increase trade throughput

- Chronium
  Allows placement of Fast Zones and Slow Zones

Secondary Goods

- (Speedium/Slowium)
  More effective goods that make higher level effects, but are specialized. Or, we could make these primary.

- Pyrite
  Allows placement of Pirate Swarms

- Deuterium
  Allows placement of Nebulae

- (Nullium)
  Allows placement of Calming Zone. Should be rare.

#Area Effects

These can be generally be placed anywhere on the map. They are circular (or roughly, depending on map granularity) They cannot be placed where they would overlap with planets or other area effects. Placing area effects should be the main focus of gameplay.

- Fast Zone / Slow Zone
  Speeds up or slows down routes passing through them.

- Nebulae
  Reduces volume of routes over a speed threshold.

- Pirate Swarm
  Reduces volume of routes under a speed threshold.

- (Calming Zone)
This effect is an exception to the no-overlapping effect rule, as its purpose is to erase other area effects.

#Events

Any area effect may spontaneously be created at random. Hostile planets may appear. (Or unexplored worlds or barren worlds may turn into hostiles.)
