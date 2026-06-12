import Environment from './components/Environment/Environment'

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
            backgroundColor: '#9E9E9E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-moon-white)',
            fontFamily: 'var(--font-pixel-zh)',
            fontSize: 'var(--font-size-lg)',
            letterSpacing: '0.05em',
            position: 'relative',
          }}
        >
          <span>摄像头画面区</span>
        </section>

        {/* ===== Layer 2: ChatArea (25%) ===== */}
        <section
          style={{
            backgroundColor: 'var(--color-parchment)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-pixel-zh)',
            fontSize: 'var(--font-size-md)',
            letterSpacing: '0.05em',
            position: 'relative',
          }}
        >
          <span>聊天区</span>
        </section>

        {/* ===== Layer 3: ControlBar (20%) ===== */}
        <section
          style={{
            backgroundColor: 'var(--color-wood-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-moon-white)',
            fontFamily: 'var(--font-pixel-zh)',
            fontSize: 'var(--font-size-md)',
            letterSpacing: '0.05em',
            position: 'relative',
          }}
        >
          <span>工具栏</span>
        </section>
      </div>
    </>
  )
}

export default App
