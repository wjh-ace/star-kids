import Environment from './components/Environment/Environment'
import CameraView from './components/CameraView/CameraView'
import ChatArea from './components/ChatArea/ChatArea'
import ControlBar from './components/ControlBar/ControlBar'

function App() {
  return (
    <>
      {/* ============================================================
          Environment Layer — z-index: 0, position: fixed
          Background scene elements (blurred, low opacity)
          ============================================================ */}
      <Environment />

      {/* ============================================================
          Main Content — CSS Grid three-layer vertical layout
          grid-template-rows: 55fr 25fr 20fr
          100vh × 100vw, no gaps, fills entire Electron window
          ============================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: '55fr 25fr 20fr',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ===== Layer 1: CameraView (55%) ===== */}
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <CameraView />
        </section>

        {/* ===== Layer 2: ChatArea (25%) ===== */}
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <ChatArea />
        </section>

        {/* ===== Layer 3: ControlBar (20%) ===== */}
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <ControlBar />
        </section>
      </div>
    </>
  )
}

export default App
