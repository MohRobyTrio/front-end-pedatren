// hooks/useFetchLogActivity.js
import { useState, useEffect, useCallback } from "react"
import { API_BASE_URL } from "../config"
import { getCookie } from "../../utils/cookieUtils"
import Swal from "sweetalert2"
import useLogout from "../Logout"
import { useNavigate } from "react-router-dom"

const useFetchLogActivity = () => {
  const { clearAuthData } = useLogout()
  const navigate = useNavigate()

  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalData, setTotalData] = useState(0)

  const token = sessionStorage.getItem("token") || getCookie("token")

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${API_BASE_URL}activity-logs?page=${currentPage}&per_page=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 401 && !window.sessionExpiredShown) {
        window.sessionExpiredShown = true
        await Swal.fire({
          title: "Sesi Berakhir",
          text: "Sesi anda telah berakhir, silakan login kembali.",
          icon: "warning",
          confirmButtonText: "OK",
        })
        clearAuthData()
        navigate("/login")
        return
      }

      if (!response.ok) throw new Error(`Error ${response.status}`)
      const data = await response.json()

      setLogs(data.data || [])
      setTotalPages(data.last_page || 1)
      setTotalData(data.total || 0)
    } catch (err) {
      console.error("Fetch log error:", err)
      setError(err.message)
      setLogs([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, limit])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return {
    logs,
    loading,
    error,
    fetchLogs,
    limit,
    setLimit,
    totalPages,
    currentPage,
    setCurrentPage,
    totalData,
  }
}

export default useFetchLogActivity
