/**
 * Bookshelf — left-edge blurred background element
 * Simple shelves with colored book rectangles
 */
function Bookshelf() {
  /* Shelf board dimensions & colors */
  const shelfColor = 'var(--color-wood-mid)'
  const shelfDark = 'var(--color-wood-dark)'
  const bookColors = [
    'var(--color-sage)',
    'var(--color-sky-blue)',
    'var(--color-honey)',
    'var(--color-star-gold)',
    'var(--color-wood-light)',
    '#C4956A',
    'var(--color-cream)',
  ]

  return (
    <div
      style={{
        position: 'fixed',
        left: '-2%',
        top: '10%',
        width: '140px',
        height: '220px',
        filter: 'blur(6px)',
        opacity: 0.4,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Shelf 1 (top) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '10px',
          backgroundColor: shelfColor,
          borderRadius: '2px',
          boxShadow: `0 2px 3px ${shelfDark}`,
        }}
      />
      {/* Books on shelf 1 */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={`book1-${i}`}
          style={{
            position: 'absolute',
            top: '12px',
            left: `${8 + i * 28}px`,
            width: '18px',
            height: `${42 + (i % 3) * 10}px`,
            backgroundColor: bookColors[i % bookColors.length],
            borderRadius: '2px 2px 0 0',
            borderLeft: `2px solid ${bookColors[(i + 2) % bookColors.length]}`,
          }}
        />
      ))}

      {/* Shelf 2 (middle) */}
      <div
        style={{
          position: 'absolute',
          top: '72px',
          left: 0,
          right: 0,
          height: '10px',
          backgroundColor: shelfColor,
          borderRadius: '2px',
          boxShadow: `0 2px 3px ${shelfDark}`,
        }}
      />
      {/* Books on shelf 2 */}
      {[0, 1, 2].map((i) => (
        <div
          key={`book2-${i}`}
          style={{
            position: 'absolute',
            top: '84px',
            left: `${14 + i * 32}px`,
            width: '20px',
            height: `${50 + (i % 2) * 14}px`,
            backgroundColor: bookColors[(i + 3) % bookColors.length],
            borderRadius: '2px 2px 0 0',
            borderLeft: `2px solid ${bookColors[(i + 1) % bookColors.length]}`,
          }}
        />
      ))}

      {/* Shelf 3 (bottom) */}
      <div
        style={{
          position: 'absolute',
          top: '150px',
          left: 0,
          right: 0,
          height: '10px',
          backgroundColor: shelfColor,
          borderRadius: '2px',
          boxShadow: `0 2px 3px ${shelfDark}`,
        }}
      />
      {/* Books on shelf 3 — taller reference books */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={`book3-${i}`}
          style={{
            position: 'absolute',
            top: '162px',
            left: `${5 + i * 26}px`,
            width: '16px',
            height: `${30 + (i % 4) * 12}px`,
            backgroundColor: bookColors[(i + 5) % bookColors.length],
            borderRadius: '2px 2px 0 0',
            borderLeft: `2px solid ${bookColors[i % bookColors.length]}`,
          }}
        />
      ))}

      {/* Stacked books lying on bottom shelf */}
      <div
        style={{
          position: 'absolute',
          top: '152px',
          left: '110px',
          width: '26px',
          height: '8px',
          backgroundColor: 'var(--color-honey)',
          borderRadius: '1px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '146px',
          left: '110px',
          width: '26px',
          height: '7px',
          backgroundColor: 'var(--color-sage)',
          borderRadius: '1px',
        }}
      />
    </div>
  )
}

export default Bookshelf
