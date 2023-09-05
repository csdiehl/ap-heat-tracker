import { useEffect, useState } from "react"

// eslint-disable-next-line react/display-name
const useData = (url: string) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function getData() {
      const res = await fetch(url)
      const data = await res.json()
      return data
    }

    getData().then((data) => setData(data))
  }, [url])

  return data
}

export default useData
