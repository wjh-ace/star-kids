/* ============================================================
   P6-T1: ControlBar — Bottom toolbar container
   REQ-001 Phase 6 | 小星 Star Kids

   - Wooden base via WoodFrame (woodSeed={12})
   - Top border-radius 16px, bottom 0 (flushes with window edge)
   - Internal flexbox: TextInput (60% width) + 5 ToolButtons
   - Replaces the placeholder section in App.tsx
   ============================================================ */

import WoodFrame from '../CameraView/WoodFrame'
import TextInput from './TextInput'
import ToolButton from './ToolButton'
import { MicIcon } from './icons/MicIcon'
import { CallIcon } from './icons/CallIcon'
import { CameraIcon } from './icons/CameraIcon'
import { SettingsIcon } from './icons/SettingsIcon'
import { StarIcon } from './icons/StarIcon'
import { useChatStore } from '../../stores/chatStore'

function ControlBar() {
  const sendMessage = useChatStore((s) => s.sendMessage)

  return (
    <div
      style={{
        // Clip bottom corners to achieve top-only border-radius
        borderRadius: '16px 16px 0 0',
        overflow: 'hidden',
        height: '100%',
        width: '100%',
      }}
    >
      {/* Wooden base — woodSeed=12 for unique grain, reduced thickness for toolbar */}
      <WoodFrame
        woodSeed={12}
        borderRadius={16}
        thickness={6}
        hasGlow={false}
      >
        {/* Internal flexbox layout */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '6px 14px',
            height: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* TextInput — takes remaining space (~60% width) */}
          <TextInput
            placeholder="跟我说点什么吧…"
            disabled={false}
            onSend={sendMessage}
          />

          {/* Tool buttons — 48×48px each (UX-R12) */}
          <ToolButton icon={<MicIcon />} label="麦克风" />
          <ToolButton icon={<CallIcon />} label="视频通话" />
          <ToolButton icon={<CameraIcon />} label="拍照" />
          <ToolButton icon={<SettingsIcon />} label="设置" />
          <ToolButton icon={<StarIcon />} label="收藏" />
        </div>
      </WoodFrame>
    </div>
  )
}

export default ControlBar
