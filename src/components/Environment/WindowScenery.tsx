/**
 * WindowScenery — blurred outdoor greenery & sunlight visible
 * beside the camera window area
 */
function WindowScenery() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '55vh',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(7px)',
        opacity: 0.35,
        overflow: 'hidden',
      }}
    >
      {/* ===== Left-side greenery ===== */}

      {/* Large plant cluster */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '-3%',
          width: '90px',
          height: '120px',
          backgroundColor: 'var(--color-sage)',
          borderRadius: '40% 60% 30% 50%',
          opacity: 0.6,
        }}
      />
      {/* Secondary foliage */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '2%',
          width: '60px',
          height: '80px',
          backgroundColor: '#8BA078',
          borderRadius: '50% 40% 40% 60%',
          opacity: 0.45,
        }}
      />
      {/* Small leaf accent */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: '1%',
          width: '40px',
          height: '55px',
          backgroundColor: '#A8B898',
          borderRadius: '50% 50% 30% 30%',
          opacity: 0.5,
        }}
      />

      {/* ===== Right-side greenery ===== */}

      <div
        style={{
          position: 'absolute',
          top: '18%',
          right: '-2%',
          width: '80px',
          height: '100px',
          backgroundColor: 'var(--color-sage)',
          borderRadius: '50% 40% 40% 60%',
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '3%',
          width: '50px',
          height: '70px',
          backgroundColor: '#7A8F6A',
          borderRadius: '40% 50% 60% 40%',
          opacity: 0.4,
        }}
      />

      {/* ===== Sunlight patches — warm dappled light ===== */}

      {/* Left sunlight */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '70px',
          height: '50px',
          background:
            'radial-gradient(ellipse at center, rgba(255,220,140,0.4) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
      {/* Right sunlight */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '8%',
          width: '55px',
          height: '40px',
          background:
            'radial-gradient(ellipse at center, rgba(255,220,140,0.35) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
      {/* Bottom sunlight near window sill */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '30px',
          background:
            'radial-gradient(ellipse at center, rgba(255,235,180,0.25) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Top sun ray */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          width: '60px',
          height: '25px',
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(255,240,180,0.3) 0%, transparent 80%)',
          borderRadius: '0 0 50% 50%',
        }}
      />
    </div>
  )
}

export default WindowScenery
