ECS.Assemblages = {
    // Each assemblage creates an entity then returns it. The entity can
    // then have components added or removed - this is just like a helper
    // factory to create objects which can still be modified

    //Ship (to create, call ECS.Assemblages.Ship(config) )
    Ship: function Ship(config){
        var mon = new ECS.Entity();
        //var sprite = new Sprite(new Vector2D(31, 25), images["e1"], 3, 4, this.grid_draw_size.scalarMult(2.0));
        mon.addComponent( new ECS.Components.HP(20));
        return mon;
    }

};
