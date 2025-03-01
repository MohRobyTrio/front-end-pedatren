import { useEffect, useState } from "react";


const Karyawan = () => {

    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    useEffect(() => {
        fetch("https://example.com/api/employees") // Ganti dengan endpoint API yang benar
            .then((response) => response.json())
            .then((data) => {
                setEmployees(data);
                setFilteredEmployees(data);
            })
            .catch((error) => console.error("Error fetching employees:", error));
    }, []);

    useEffect(() => {
        setFilteredEmployees(
            employees.filter((employee) =>
                employee.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, employees]);

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Karyawan</h1>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Cari karyawan..."
                    className="p-2 border rounded w-full mb-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredEmployees.map((employee) => (
                        <div key={employee.id} className="p-4 border rounded shadow">
                            <img src={employee.photo} alt={employee.name} className="w-full h-32 object-cover mb-2" />
                            <h2 className="text-lg font-semibold">{employee.name}</h2>
                            <p>{employee.position}</p>
                            <p>{employee.institution}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Karyawan;