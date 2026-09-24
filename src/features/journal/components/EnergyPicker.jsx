import { BoltIcon } from '../../../components/icons.jsx'
import Segmented from '../../../components/ui/Segmented.jsx'
import { ENERGY_LEVELS } from '../moods.js'

const OPTIONS = ENERGY_LEVELS.map((level) => ({
  value: level.value,
  label: level.label,
  icon: (
    <span aria-hidden="true" className="flex">
      {Array.from({ length: level.value }, (_, i) => (
        <BoltIcon key={i} className="-mx-[3px] size-3" />
      ))}
    </span>
  ),
}))

export default function EnergyPicker({ value, onChange }) {
  return <Segmented label="Energy" options={OPTIONS} value={value} onChange={onChange} deselectable />
}
