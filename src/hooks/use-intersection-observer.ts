"use client"

import { useEffect } from "react"

function useIntersectionObserver(
	callback: IntersectionObserverCallback,
	ref: React.RefObject<HTMLElement> | React.RefObject<null> | null,
	config: IntersectionObserverInit = {
		root: null,
		rootMargin: "0px",
		threshold: 0.1,
	},
) {
	useEffect(() => {
		if (ref?.current) {
			const observer = new IntersectionObserver(callback, config)

			observer.observe(ref.current)

			return () => {
				observer.disconnect()
			}
		}
	}, [callback, ref, config])
}

export default useIntersectionObserver
