//Type of entity: building or mobile
ECS.Components.Type = function ComponentType (value){
    this.value = value;

    return this;
};
ECS.Components.Type.prototype.name = 'type';
