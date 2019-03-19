import WebGLRenderer from './RoundRectangleWebGLRenderer.js'
import CanvasRenderer from './RoundRectangleCanvasRenderer.js';
import NOOP from '../../../utils/object/NOOP.js';

var renderWebGL = NOOP;
var renderCanvas = NOOP;

if (Phaser.WEBGL_RENDERER) {
    renderWebGL = WebGLRenderer;
}
if (Phaser.CANVAS_RENDERER) {
    renderCanvas = CanvasRenderer;
}

export default {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};