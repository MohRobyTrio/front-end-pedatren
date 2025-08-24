"use client"

import { useState } from "react"

const ChildSelector = () => {
    const students = [
        {
            id: 1,
            name: "Muhammad Faiz Ahmad",
            nis: "2024001",
            class: "X IPA 1",
            photoUrl: "/placeholder.svg?height=100&width=100",
            dormStatus: "Mondok",
        },
        {
            id: 2,
            name: "Siti Aisyah Ahmad",
            nis: "2024002",
            class: "VIII A",
            photoUrl: "/placeholder.svg?height=100&width=100",
            dormStatus: "Pulang",
        },
        {
            id: 3,
            name: "Abdullah Ahmad",
            nis: "2024003",
            class: "XII IPS 2",
            photoUrl: "/placeholder.svg?height=100&width=100",
            dormStatus: "Mondok",
        },
    ]

    const [selectedStudent, setSelectedStudent] = useState(students[0] || null)

    const selectStudent = (student) => {
        setSelectedStudent(student)
    }

    if (students.length <= 1) return null

    return (
        <div className="fixed left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3">
            <div
                className="flex items-center gap-4 overflow-x-auto"
                style={{
                    scrollbarWidth: "none",    /* Firefox */
                    msOverflowStyle: "none"    /* IE/Edge */
                }}
            >
                {/* <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Pilih Anak:</span> */}
                <div className="flex gap-2 px-2">
                    {students.map((student) => (
                        <button
                            key={student.id}
                            onClick={() => selectStudent(student)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedStudent?.id === student.id
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                }`}
                        >
                            {/* <img
                src={student.photoUrl || "/placeholder.svg"}
                alt={student.name}
                className="w-6 h-6 rounded-full object-cover"
              /> */}
                            <i className="fas fa-user-circle text-xl"></i>
                            <span>{student.name}</span>
                            {selectedStudent?.id === student.id && <i className="fas fa-check text-xs"></i>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ChildSelector
