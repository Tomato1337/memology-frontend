import { worker } from '@/mocks/browser'

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
    worker.start({ onUnhandledRequest: 'bypass' })
}
