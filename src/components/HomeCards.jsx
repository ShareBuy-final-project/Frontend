import React from 'react'
import Card from './Card'
import { Link } from 'react-router-dom'
const HomeCards = () => {
  return (
    <div> <section className="py-4">
    <div className="container-xl lg:container m-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
        <Card>
            <h2 className="text-2xl font-bold">For busineses</h2>
            <p className="mt-2 mb-4">
                Boost your business with group deals!
            </p>
            <Link
                href="/jobs.html"
                className="inline-block bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-700">
                Create a deal
          </Link>
        </Card>
        <Card bg='bg-indigo-200'>
          <h2 className="text-2xl font-bold">For customers</h2>
          <p className="mt-2 mb-4">
          Discover your perfect group deal!
          </p>
          <Link
            href="/add-job.html"
            className="inline-block bg-indigo-700 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
          >
            Browse deals
          </Link>
        </Card>
        </div>
      </div>
  </section></div>
  )
}

export default HomeCards