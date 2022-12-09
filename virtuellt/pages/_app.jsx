import '../styles/globals.css'
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import Loader from '../components/Loader'

import { Open_Sans } from '@next/font/google'

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
})

const App = ({ Component, pageProps: { session, ...pageProps }, }) => {
  return (
    <SessionProvider session={session}>
      <Auth page={Component.name}>
        <main className={`${openSans.variable} font-sans`}>
          <Component {...pageProps} />
        </main>
      </Auth>
    </SessionProvider>
  )
}

const Auth = ({ children, page }) => {
  const { data: session, status } = useSession();
  const router = useRouter()

  if (status === "loading") {
    return <Loader />
  }

  // maybe apply XOR for status and unauthenticatedPages check

  const unauthenticatedPages = ["/reset_request", "/reset_password"]
  const role_map = {
    "ORGANIZATION": "/admin",
    "MEMBER": "/member",
    "PARTNER": "/partner"
  }

  if (router.pathname === "/") {
    return children
  }

  if (status === "authenticated") {
    if (unauthenticatedPages.includes(router.pathname)) {
      router.back()
      return <Loader />
    }

    const role_check = Object.entries(role_map).reduce(
      (acc, [role, path]) => (acc || (router.pathname.startsWith(path) && session.user.role !== role))
    , false)

    if (role_check) {
      router.back()
      return <Loader />
    }
  } else {
    if (!unauthenticatedPages.includes(router.pathname)) {
      router.push("/")
      return <Loader />
    }
  }

  return children
}

export default App
