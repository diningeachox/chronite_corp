import * as Assets from "./assets.js";



ECS.systems.selection = function systemSelection (game) {
    //Check raycasting intersections
    var INTERSECTED;
    Assets.raycaster.setFromCamera( Assets.pointer, Assets.ortho_camera );

    const intersects = Assets.raycaster.intersectObjects( Assets.scene.children, false );

    //Make all selection spheres invisible
    for (var key of Object.keys(matching_sphere)){

        if (game.selected_entity != matching_entity[key]){
            matching_sphere[key].material.opacity = 0.0;
            matching_sphere[key].material.color.setRGB(1, 1, 1);
        }
    }

    if ( intersects.length > 0 ) {
        if (intersects[0].object) {
            //console.log(intersects[0].object);
            if (matching_sphere.hasOwnProperty(intersects[0].object.uuid)){
                matching_sphere[intersects[0].object.uuid].material.opacity = 0.3;
                var entity = matching_entity[intersects[0].object.uuid];
                if (flags["mouse_down"]){
                    if (!entity.components.selected.value){
                        entity.components.selected.value = true;
                        //Turn selection sphere red
                        matching_sphere[intersects[0].object.uuid].material.color.setRGB(0, 1, 0);
                        if (game.selected_entity != null){
                            game.selected_entity.components.selected.value = false;
                        }
                        game.selected_entity = entity;
                    } else {
                        entity.components.selected.value = false;
                        game.selected_entity = null;
                    }
                }
            }
        }
    }

}

ECS.systems.render = function systemRender (entities, delta) {

}
