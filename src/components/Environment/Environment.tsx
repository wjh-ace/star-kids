/**
 * Environment — background scene container
 * Renders all ambient environment elements behind the main UI layers.
 * All children are position: fixed with z-index: 0 and pointer-events: none.
 */
import Bookshelf from './Bookshelf'
import HangingPainting from './HangingPainting'
import PottedPlant from './PottedPlant'
import NightLamp from './NightLamp'
import WindowScenery from './WindowScenery'
import WarmLightOverlay from './WarmLightOverlay'

function Environment() {
  return (
    <>
      {/* Warm directional light — lowest layer, full screen */}
      <WarmLightOverlay />

      {/* Bookshelf — left edge, blurred */}
      <Bookshelf />

      {/* Hanging painting — top-right corner (UX-R14) */}
      <HangingPainting />

      {/* Potted plants — bottom corners */}
      <PottedPlant side="left" />
      <PottedPlant side="right" />

      {/* Night lamp — bottom-right warm glow */}
      <NightLamp />

      {/* Window scenery — greenery beside camera area */}
      <WindowScenery />
    </>
  )
}

export default Environment
