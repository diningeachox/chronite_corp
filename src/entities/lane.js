const lane = (config) => {
  const ent = new ECS.Entity();
  ent.addComponent( new ECS.Components.OriginPlanet(config.origin));
  ent.addComponent( new ECS.Components.DestinationPlanet(config.destination));
  ent.addComponent( new ECS.Components.Ships(0));
  return ent;
}