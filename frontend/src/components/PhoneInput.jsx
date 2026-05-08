import { useState } from 'react'

const COUNTRIES = [
  { code: '55',  flag: '🇧🇷', label: 'BR' },
  { code: '1',   flag: '🇺🇸', label: 'US' },
  { code: '351', flag: '🇵🇹', label: 'PT' },
  { code: '34',  flag: '🇪🇸', label: 'ES' },
  { code: '44',  flag: '🇬🇧', label: 'UK' },
  { code: '49',  flag: '🇩🇪', label: 'DE' },
  { code: '33',  flag: '🇫🇷', label: 'FR' },
  { code: '39',  flag: '🇮🇹', label: 'IT' },
  { code: '54',  flag: '🇦🇷', label: 'AR' },
  { code: '56',  flag: '🇨🇱', label: 'CL' },
  { code: '57',  flag: '🇨🇴', label: 'CO' },
  { code: '52',  flag: '🇲🇽', label: 'MX' },
]

const formatNumber = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`
  if (digits.length <= 11) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`
}

export default function PhoneInput({ value, onChange }) {
  const [country, setCountry] = useState(COUNTRIES[0])
  const [open, setOpen] = useState(false)

  const handleNumber = (e) => {
    const formatted = formatNumber(e.target.value)
    const digits = formatted.replace(/\D/g, '')
    onChange(`${country.code}${digits}`, formatted)
  }

  const selectCountry = (c) => {
    setCountry(c)
    setOpen(false)
    const digits = value.replace(/\D/g, '')
    onChange(`${c.code}${digits}`, value)
  }

  return (
    <div className="relative flex w-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-visible focus-within:border-amber-400 transition">

      {/* Seletor de país */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-3 border-r border-zinc-800 shrink-0 hover:bg-zinc-800 transition"
      >
        <span className="text-lg">{country.flag}</span>
        <span className="text-zinc-400 text-xs">+{country.code}</span>
        <span className="text-zinc-600 text-xs">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {COUNTRIES.map(c => (
            <button
              key={c.code}
              type="button"
              onClick={() => selectCountry(c)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-800 transition text-left ${
                country.code === c.code ? 'text-amber-400' : 'text-zinc-300'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.label}</span>
              <span className="text-zinc-500 ml-auto">+{c.code}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input do número */}
      <input
        type="tel"
        value={value}
        onChange={handleNumber}
        placeholder="(11) 99999-0000"
        maxLength={15}
        className="flex-1 bg-transparent text-white px-4 py-3 text-sm placeholder-zinc-600 focus:outline-none"
      />
    </div>
  )
}
