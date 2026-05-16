import { useEffect, useState } from 'react'

const formatClock = (date) =>
  [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')

export const useStatusClock = () => {
  const [clock, setClock] = useState(() => formatClock(new Date()))

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClock(formatClock(new Date()))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return clock
}
