import React, { useEffect, useState } from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import NewCollections from '../Components/NewCollections/NewCollections'
import NewsLetter from '../Components/NewsLetter/NewsLetter'
import { backend_url } from '../App'

const Shop = () => {

  const [popular, setPopular] = useState([]);
  const [newcollection, setNewCollection] = useState([]);

  const fetchInfo = () => {
    fetch(`${backend_url}/popularinwomen`)
      .then((res) => res.json())
      .then((data) => {
        // Handle new API response structure
        if (data.products) {
          setPopular(data.products);
        } else if (Array.isArray(data)) {
          setPopular(data);
        }
      })
    fetch(`${backend_url}/newcollections`)
      .then((res) => res.json())
      .then((data) => {
        // Handle new API response structure
        if (data.products) {
          setNewCollection(data.products);
        } else if (Array.isArray(data)) {
          setNewCollection(data);
        }
      })
  }

  useEffect(() => {
    fetchInfo();
  }, [])


  return (
    <div>
      <Hero />
      <Popular data={popular} />
      <NewCollections data={newcollection} />
      <NewsLetter />
    </div>
  )
}

export default Shop
