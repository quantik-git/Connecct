import Layout from '../components/Layout.jsx'


const Home = () => {

  return (
    <Layout>
      <main className="w-full max-w-7xl flex-1 px-12 grid grid-cols-2 items-center justify-center">
        <div className="flex flex-col items-center justify-start lg:items-start col-span-2 lg:col-span-1 pb-11">
          <h1 className="text-7xl font-semibold tracking-tight mb-2">
            Welcome <br />to&nbsp;<span className="text-indigo-600 tracking-wider leading-none font-normal"><span className="text-8xl italic">V</span>irtuellt</span>
          </h1>
          <p className="text-gray-700 leading-5 text-base">The virtual membership card manager of the future</p>
        </div>

        <div className="hidden col-span-1 relative lg:flex justify-end">
          <article className="absolute z-10 right-5 flex flex-col justify-between bg-gradient-to-br from-blue-400 via-indigo-500 to-indigo-500 text-white text-lg shadow-lg rounded-2xl px-6 py-4 h-48 w-80 sm:h-56 sm:w-96">
            <div className="flex mb-6 justify-between">
              <p className="font-bold text-2xl">AMC</p>
            </div>
            <div className="flex justify-end content-end">
              <p className="font-semibold">Alan Turing</p>
            </div>
          </article>
          <article className="mt-4 bg-indigo-500/60 shadow-lg rounded-2xl px-6 py-4 h-48 w-80 sm:h-56 sm:w-96">
          </article>
        </div>
      </main >
    </Layout >
  )
}

export default Home
