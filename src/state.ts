import create from 'zustand'
import { ControlMode } from './control-mode'

interface ZustandStore {
  controlMode: ControlMode,
  isRepositioningMapPiece: boolean,
  onRepositioningMapPieceStart: () => void
  onRepositioningMapPieceStop: () => void
  setControlMode: (controlMode: ControlMode) => void
}

const [useStore, storeApi] = create<ZustandStore>(set => ({
  controlMode: ControlMode.EDIT,
  isRepositioningMapPiece: false,
  onRepositioningMapPieceStart: () => {
    return set({ isRepositioningMapPiece: true })
  },
  onRepositioningMapPieceStop: () => {
    set({ isRepositioningMapPiece: false })
  },
  setControlMode: (controlMode: ControlMode) => set(state => ({ controlMode })),
}))

export { useStore, storeApi}
