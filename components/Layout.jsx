import Head from "next/head"
import Image from "next/image"
import Link from "next/link"


const Layout = ({children, page}) => {
  return (
    <div>
        <Head>
            <title>Diseña - {page}</title>
            <meta name="description" content="Sitio Web para diseñar estructuras"/>
        </Head>
        <nav className="flex items-center justify-between flex-wrap bg-blue-600 p-3">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                
                <span className="font-semibold text-xl tracking-tight">Civil JAA Tech</span>
            </div>
            <div className="block lg:hidden">
                <button className="flex items-center px-3 py-2 border rounded text-blue-200 border-teal-400 hover:text-white hover:border-white">
                <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                </button>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                <Link href="/">
                    <p className=" cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
                        Inicio
                    </p>
                </Link>
                <Link href="/vigasflex" className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
                    <p className="cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
                        Vigas A flexión
                    </p>
                </Link>
                <Link href="/cortantes">
                    <p className="cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
                        Vigas A cortante
                    </p>
                </Link>
                <Link href="/escaleras">
                    <p className="cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
                        Escaleras
                    </p>
                </Link>
                <Link href="/losas">
                    <p className="cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
                        Losas
                    </p>
                </Link>
                </div>
            </div>
        </nav>

        {children}
    </div>

  )
}

export default Layout