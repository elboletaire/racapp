import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'

export interface Filters {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  highlightBelowPrice: number
  setHighlightBelowPrice: Dispatch<SetStateAction<number>>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  order: string
  setOrder: Dispatch<SetStateAction<string>>
  sortBy: string
  setSortBy: Dispatch<SetStateAction<string>>
}

export const FiltersContext = createContext<Filters>({
  search: '',
  setSearch: () => {},
  highlightBelowPrice: 0,
  setHighlightBelowPrice: () => {},
  page: 0,
  setPage: () => {},
  order: '',
  setOrder: () => {},
  sortBy: '',
  setSortBy: () => {},
})

export const FiltersProvider = ({children} : {children: ReactNode}) => {
  const [ search, setSearch ] = useState<string>('')
  const [ highlightBelowPrice, setHighlightBelowPrice ] = useState<number>(0)
  const [ page, setPage ] = useState<number>(1)
  const [ order, setOrder ] = useState<string>('desc')
  const [ sortBy, setSortBy ] = useState<string>('created_at')

  return (
    <FiltersContext.Provider value={{
      search,
      setSearch,
      highlightBelowPrice,
      setHighlightBelowPrice,
      page,
      setPage,
      order,
      setOrder,
      sortBy,
      setSortBy,
    }}>
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
