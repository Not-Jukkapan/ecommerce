import { Outlet } from "react-router-dom"

type Props = {}

function LayoutWrapper({}: Props) {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-8 py-4 border border-gray-300 rounded shadow-md">
        <Outlet />
    </div>
  )
}

export default LayoutWrapper