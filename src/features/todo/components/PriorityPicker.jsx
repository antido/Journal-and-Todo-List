import { FlagIcon } from '../../../components/icons.jsx'
import Segmented from '../../../components/ui/Segmented.jsx'
import { PRIORITIES } from '../constants.js'

const OPTIONS = PRIORITIES.map((priority) => ({
  value: priority.value,
  label: priority.label,
  icon: <FlagIcon className={`size-3 ${priority.iconClass}`} />,
}))

/** Low / Medium / High; clicking the selected level clears it. */
export default function PriorityPicker({ value, onChange }) {
  return <Segmented label="Priority" options={OPTIONS} value={value} onChange={onChange} deselectable />
}
