'use client'

import { useEffect } from 'react'

function useIntersectionObserver(
    callback: IntersectionObserverCallback,
    ref: React.RefObject<HTMLElement> | React.RefObject<null> | null,
    config: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
    }
) {
    useEffect(() => {
        console.log('effect', ref)
        if (ref?.current) {
            const observer = new IntersectionObserver(callback, config)

            observer.observe(ref.current)
            console.log('register')

            return () => {
                console.log('disconnect')
                observer.disconnect()
            }
        }
    }, [callback, ref, config])
}

export default useIntersectionObserver
