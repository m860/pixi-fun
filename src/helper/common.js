/**
 * Created by xxx on 2017/1/15.
 */
export function createRenderer (width, height, debug = false,rendererOps={},target=document.body) {
    let renderer;
    if (debug) {
        renderer = new CanvasRenderer(width, height,rendererOps);
    }
    else {
        renderer = autoDetectRenderer(width, height,rendererOps);
    }
    target.appendChild(renderer.view);
    return renderer;
}

export function applyDebugDrawForBox2D (world, context, scale = 30.0){
    let debugDraw = new Box2D.Dynamics.b2DebugDraw();
    debugDraw.SetSprite(context);
    debugDraw.SetAlpha(0.5);
    debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit /*| b2DebugDraw.e_centerOfMassBit*/);
    debugDraw.SetDrawScale(scale);
    world.SetDebugDraw(debugDraw);
};