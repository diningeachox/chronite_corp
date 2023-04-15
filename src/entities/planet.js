import goods from './goods';

const planet = (config) => {
  const ent = new ECS.Entity();
  ent.addComponent( new ECS.Components.Type(config.type || "standard"));
  ent.addComponent( new ECS.Components.HP(config.HP || 100));
  ent.addComponent( new ECS.Components.OutputGood(config.output));
  ent.addComponent( new ECS.Components.InputGoods(config.input || []));
  ent.addComponent( new ECS.Components.Position(config.position || [100,100]));
  return ent;
}

const hqPlanet = planet({type: "hq", input:{type: goods.gold, max:1000}}); //TODO use objects for planet types

// The idea here is that we'll want to start with one of each 
// of a basic set of planets that provide everything. 

const startingPlanet = (i) => {
  const config = {input: [], type: "standard"};
  switch (i) {
    case 0:
      config.output = goods.metal;
      break;
    case 1:
      config.output = goods.chronium;
      break;
    case 2: 
      config.output = goods.ships;
      config.input.push({type: goods.metal, max:50});
      break;
    case 3:
      config.output = goods.gold;
      config.input.push({type: goods.chronium, max:30});
      config.input.push({type: goods.metal, max:30});
  }

  return planet(config);
}

const scoutedPlanet = () => {

}

export default Planet