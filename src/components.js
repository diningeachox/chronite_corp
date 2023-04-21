//Type of entity: building or mobile
ECS.Components.Type = function ComponentType (value){
    this.value = value;

    return this;
};
ECS.Components.Type.prototype.name = 'type';

ECS.Components.Carry = function ComponentCarry (value){
    this.value = value;

    return this;
};
ECS.Components.Carry.prototype.name = 'carry';

ECS.Components.Capacity = function ComponentCapacity (value){
    this.value = value;

    return this;
};
ECS.Components.Capacity.prototype.name = 'capacity';

ECS.Components.Cooldown = function ComponentCooldown (value){
    this.value = value;

    return this;
};
ECS.Components.Cooldown.prototype.name = 'cooldown';

ECS.Components.Speed = function ComponentSpeed (value){
    this.value = value;

    return this;
};
ECS.Components.Speed.prototype.name = 'speed';

ECS.Components.HP = function ComponentHP (value){
    this.value = value;

    return this;
};
ECS.Components.HP.prototype.name = 'hp';

ECS.Components.Hostile = function ComponentHostile (value){
    this.value = value;

    return this;
};
ECS.Components.Hostile.prototype.name = 'hostile';

ECS.Components.Scouted = function ComponentScouted (value){
    this.value = value;

    return this;
};
ECS.Components.Scouted.prototype.name = 'scouted';

ECS.Components.Active = function ComponentActive (value){
    this.value = value;

    return this;
};
ECS.Components.Active.prototype.name = 'active';

ECS.Components.OutputGood = function ComponentOutputGood (value){
    this.value = value;

    return this;
};
ECS.Components.OutputGood.prototype.name = 'outputgood';

ECS.Components.InputGoods = function ComponentInputGoods (value){
    this.value = value;

    return this;
};
ECS.Components.InputGoods.prototype.name = 'inputgoods';

ECS.Components.Ships = function ComponentShips (value){
    this.value = value;

    return this;
};
ECS.Components.Ships.prototype.name = 'ships';

ECS.Components.Position = function ComponentPosition (value){
    this.value = value;

    return this;
};
ECS.Components.Position.prototype.name = 'position';

ECS.Components.Selected = function ComponentSelected (value){
    this.value = value;

    return this;
};
ECS.Components.Selected.prototype.name = 'selected';

ECS.Components.OriginPlanet = function ComponentOriginPlanet (value){
    this.value = value;

    return this;
};
ECS.Components.OriginPlanet.prototype.name = 'originplanet';

ECS.Components.DestinationPlanet = function ComponentDestinationPlanet (value){
    this.value = value;

    return this;
};
ECS.Components.DestinationPlanet.prototype.name = 'destinationplanet';

ECS.Components.Lane = function ComponentLane (value){
    this.value = value;

    return this;
};
ECS.Components.Lane.prototype.name = 'lane';

ECS.Components.Planet = function ComponentPlanet (value){
    this.value = value;

    return this;
};
ECS.Components.Planet.prototype.name = 'planet';

//Sprite/mesh associated with entity
ECS.Components.Asset = function ComponentAsset (value){
    this.value = value;

    return this;
};
ECS.Components.Asset.prototype.name = 'asset';
