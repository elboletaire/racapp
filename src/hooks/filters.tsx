import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'

export interface Filters {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  highlightBelowPrice: number
  setHighlightBelowPrice: Dispatch<SetStateAction<number>>
}

export const FiltersContext = createContext<Filters>({
  search: '',
  setSearch: () => {},
  highlightBelowPrice: 0,
  setHighlightBelowPrice: () => {},
})

export const FiltersProvider = ({children} : {children: ReactNode}) => {
  const [ search, setSearch ] = useState<string>('')
  const [ highlightBelowPrice, setHighlightBelowPrice ] = useState<number>(0)

  return (
    <FiltersContext.Provider value={{search, setSearch, highlightBelowPrice, setHighlightBelowPrice}}>
      {children}
    </FiltersContext.Provider>
  )
}

export const useFilters = () => {
  const cntxt = useContext(FiltersContext)

  if (!cntxt) {
    throw new Error('useFilters must be used as a children of <FiltersProvider />')
  }

  return cntxt
}
