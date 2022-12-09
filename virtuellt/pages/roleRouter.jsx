import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Loader from "../components/Loader"

const redirects = {
    "MEMBER": "/member",
    "ORGANIZATION": "/admin",
    "PARTNER": "/partner"
}

const RoleRouter = () => {
    const router = useRouter()
    const { data: session, status} = useSession()

    useEffect(() => {
        if (status === "authenticated") {
            router.push(redirects[session.user.role])
        }
    }, [status])
    
    return <Loader />
}

export default RoleRouter