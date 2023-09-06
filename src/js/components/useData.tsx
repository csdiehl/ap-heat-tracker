import { useEffect, useState } from "react"

const useData = (url: string) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function getData(url: string) {
      console.log("fetching data")
      const res = await fetch(url)

      try {
        const data = await res.json()
        return data
      } catch {
        const res = await fetch("./fallback-data.json")
        const data = await res.json()
        return data
      }
    }

    getData(url).then((data) => setData(data))
  }, [url])

  return data
}

export default useData
