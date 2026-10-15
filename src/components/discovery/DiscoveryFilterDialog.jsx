import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { X } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { discoveryFilters, emptyFilters } from '../../data/venues'

export default function DiscoveryFilterDialog({ filters, onApply, onClose }) {
  const { tx, isEn } = useLanguage()
  const [draft, setDraft] = useState(filters)
  return <Dialog open onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="dg-filter-title" slotProps={{ paper: { className: 'dg-filter-dialog' } }}>
    <DialogTitle id="dg-filter-title">{isEn ? 'Detailed criteria' : 'Tiêu chí chi tiết'}<button type="button" onClick={onClose} aria-label={isEn ? 'Close filters' : 'Đóng bộ lọc'}><X size={20} /></button></DialogTitle>
    <DialogContent><div className="dg-filter-fields">{discoveryFilters.map((filter) => filter.key === 'amenities' ? <fieldset key={filter.key}><legend>{tx(filter.label)}</legend>{filter.options.map((option) => <label key={option}><input type="checkbox" checked={draft.amenities.includes(option)} onChange={(event) => setDraft((current) => ({ ...current, amenities: event.target.checked ? [...current.amenities, option] : current.amenities.filter((item) => item !== option) }))} />{tx(option)}</label>)}</fieldset> : <label key={filter.key}>{tx(filter.label)}<select value={draft[filter.key]} onChange={(event) => setDraft((current) => ({ ...current, [filter.key]: event.target.value }))}><option value="">{isEn ? 'Any' : 'Tất cả'}</option>{filter.options.map((option) => { const [value, label] = Array.isArray(option) ? option : [option, option]; return <option key={value} value={value}>{tx(label)}</option> })}</select></label>)}</div></DialogContent>
    <DialogActions><button type="button" className="dg-filter-reset" onClick={() => setDraft(emptyFilters)}>{isEn ? 'Reset filters' : 'Đặt lại bộ lọc'}</button><button type="button" className="dg-primary" onClick={() => { onApply(draft); onClose() }}>{isEn ? 'Apply filters' : 'Áp dụng bộ lọc'}</button></DialogActions>
  </Dialog>
}
