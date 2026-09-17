import { animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration = 1.6) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const controls = animate(0, target, {
      duration: prefersReduced ? 0 : duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    })

    return () => controls.stop()
  }, [inView, target, duration])

  return { ref, value }
}
