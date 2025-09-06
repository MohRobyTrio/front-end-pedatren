"use client"

import { useState, useEffect } from "react"

export const useActiveChild = () => {
  const [activeChild, setActiveChild] = useState(null)

  useEffect(() => {
    // Function to get active child from sessionStorage
    const getActiveChild = () => {
      if (typeof window === "undefined") return null
      const stored = sessionStorage.getItem("active_child")
      return stored ? JSON.parse(stored) : null
    }

    // Set initial value
    setActiveChild(getActiveChild())

    // Listen for storage changes (when updated from other components)
    const handleStorageChange = (e) => {
      if (e.key === "active_child") {
        setActiveChild(e.newValue ? JSON.parse(e.newValue) : null)
      }
    }

    // Listen for custom events (for same-tab updates)
    const handleActiveChildChange = (e) => {
      setActiveChild(e.detail)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange)
      window.addEventListener("activeChildChanged", handleActiveChildChange)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange)
        window.removeEventListener("activeChildChanged", handleActiveChildChange)
      }
    }
  }, [])

  const updateActiveChild = (child) => {
    setActiveChild(child)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("active_child", JSON.stringify(child))
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new CustomEvent("activeChildChanged", { detail: child }))
    }
  }

  return { activeChild, updateActiveChild }
}
