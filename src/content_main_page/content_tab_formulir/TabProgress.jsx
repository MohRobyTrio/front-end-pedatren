import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import blankProfile from "../../assets/blank_profile.png";
import { ModalAddProgressAfektifFormulir, ModalAddProgressKognitifFormulir, ModalKeluarProgressFormulir } from "../../components/modal/modal_formulir/ModalFormProgress";
import useLogout from "../../hooks/Logout";
import { hasAccess } from "../../utils/hasAccess";
import Access from "../../components/Access";

const TabProgress = () => {
	const { biodata_id } = useParams();
	const { clearAuthData } = useLogout();
	const navigate = useNavigate();
	const canEdit = hasAccess("edit");
	const [activeTab, setActiveTab] = useState("afektif");
	const [showAddAfektifModal, setShowAddAfektifModal] = useState(false);
	const [showAddKognitifModal, setShowAddKognitifModal] = useState(false);
	const [showOutModal, setShowOutModal] = useState(false);
	const [dataList, setDataList] = useState([]);
	const [selectedDataId, setSelectedDataId] = useState(null);
	const [selectedAfektifDetail, setSelectedAfektifDetail] = useState(null);
	const [selectedKognitifDetail, setSelectedKognitifDetail] = useState(null);
	const [endDate, setEndDate] = useState("");
	const [startDate, setStartDate] = useState("");
	const [error, setError] = useState(false);

	const [loadingData, setLoadingData] = useState(true);
	const [loadingDetailData, setLoadingDetailData] = useState(null);

	const [formAfektif, setFormAfektif] = useState({
		kepedulian_nilai: "",
		kepedulian_tindak_lanjut: "",
		kebersihan_nilai: "",
		kebersihan_tindak_lanjut: "",
		akhlak_nilai: "",
		akhlak_tindak_lanjut: ""
	});

	const [formKognitif, setFormKognitif] = useState({
		kebahasaan_nilai: "",
		kebahasaan_tindak_lanjut: "",
		baca_kitab_kuning_nilai: "",
		baca_kitab_kuning_tindak_lanjut: "",
		hafalan_tahfidz_nilai: "",
		hafalan_tahfidz_tindak_lanjut: "",
		furudul_ainiyah_nilai: "",
		furudul_ainiyah_tindak_lanjut: "",
		tulis_alquran_nilai: "",
		tulis_alquran_tindak_lanjut: "",
		baca_alquran_nilai: "",
		baca_alquran_tindak_lanjut: ""
	});

	const fetchData = useCallback(async (endpoint) => {
		const token = sessionStorage.getItem("token") || getCookie("token");
		if (!biodata_id || !token) return;
		try {
			setError(false);
			setLoadingData(true);
			const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/catatan-${endpoint}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});
			if (response.status === 401) {
				await Swal.fire({
					title: "Sesi Berakhir",
					text: "Sesi anda telah berakhir, silakan login kembali.",
					icon: "warning",
					confirmButtonText: "OK",
				});
				clearAuthData();
				navigate("/login");
				return;
			}
			const result = await response.json();
			console.log(result);

			setDataList(result.data || []);
			endpoint == "afektif" ? setSelectedAfektifDetail(null) : setSelectedKognitifDetail(null);
		} catch (error) {
			console.error("Gagal mengambil data Afektif:", error);
			setError(true);
		} finally {
			setLoadingData(false);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [biodata_id]);

	useEffect(() => {
		if (activeTab) {
			fetchData(activeTab);
		}
	}, [activeTab, fetchData]);

	const handleCardClick = async (id, endpoint) => {
		try {
			setLoadingDetailData(id);
			const token = sessionStorage.getItem("token") || getCookie("token");
			const response = await fetch(`${API_BASE_URL}formulir/${id}/catatan-${endpoint}/show`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				}
			);
			if (response.status === 401) {
				await Swal.fire({
					title: "Sesi Berakhir",
					text: "Sesi anda telah berakhir, silakan login kembali.",
					icon: "warning",
					confirmButtonText: "OK",
				});
				clearAuthData();
				navigate("/login");
				return;
			}
			const result = await response.json();
			console.log(result);

			setSelectedDataId(id);
			if (endpoint == "afektif") {
				setSelectedAfektifDetail(result.data);
				setFormAfektif({
					kepedulian_nilai: result.data.kepedulian_nilai || "",
					kepedulian_tindak_lanjut: result.data.kepedulian_tindak_lanjut || "",
					kebersihan_nilai: result.data.kebersihan_nilai || "",
					kebersihan_tindak_lanjut: result.data.kebersihan_tindak_lanjut || "",
					akhlak_nilai: result.data.akhlak_nilai || "",
					akhlak_tindak_lanjut: result.data.akhlak_tindak_lanjut || ""
				});
			} else {
				setSelectedKognitifDetail(result.data);
				setFormKognitif({
					kebahasaan_nilai: result.data.kebahasaan_nilai || "",
					kebahasaan_tindak_lanjut: result.data.kebahasaan_tindak_lanjut || "",
					baca_kitab_kuning_nilai: result.data.baca_kitab_kuning_nilai || "",
					baca_kitab_kuning_tindak_lanjut: result.data.baca_kitab_kuning_tindak_lanjut || "",
					hafalan_tahfidz_nilai: result.data.hafalan_tahfidz_nilai || "",
					hafalan_tahfidz_tindak_lanjut: result.data.hafalan_tahfidz_tindak_lanjut || "",
					furudul_ainiyah_nilai: result.data.furudul_ainiyah_nilai || "",
					furudul_ainiyah_tindak_lanjut: result.data.furudul_ainiyah_tindak_lanjut || "",
					tulis_alquran_nilai: result.data.tulis_alquran_nilai || "",
					tulis_alquran_tindak_lanjut:  result.data.tulis_alquran_tindak_lanjut || "",
					baca_alquran_nilai: result.data.baca_alquran_nilai || "",
					baca_alquran_tindak_lanjut: result.data. baca_alquran_tindak_lanjut || ""
				});
			}
			setEndDate(result.data.tanggal_selesai || "");
			setStartDate(result.data.tanggal_buat || "");
		} catch (error) {
			console.error("Gagal mengambil detail Afektif:", error);
		} finally {
			setLoadingDetailData(null);
		}
	};

	const handleUpdate = async (endpoint) => {
		if (!selectedAfektifDetail && endpoint == "afektif") return;
		if (!selectedKognitifDetail && endpoint == "kognitif") return;

		const payload = {
			tanggal_buat: startDate,
			...(endpoint === "kognitif" ? formKognitif : formAfektif )
		};

		console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2));

		try {
			Swal.fire({
				title: 'Mohon tunggu...',
				html: 'Sedang proses.',
				allowOutsideClick: false,
				didOpen: () => {
					Swal.showLoading();
				}
			});
			// setLoadingUpdateAfektif(true);
			const token = sessionStorage.getItem("token") || getCookie("token");
			const response = await fetch(
				`${API_BASE_URL}formulir/${selectedDataId}/catatan-${endpoint}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify(payload),
				}
			);
			if (response.status === 401) {
				await Swal.fire({
					title: "Sesi Berakhir",
					text: "Sesi anda telah berakhir, silakan login kembali.",
					icon: "warning",
					confirmButtonText: "OK",
				});
				clearAuthData();
				navigate("/login");
				return;
			}
			console.log(`${API_BASE_URL}formulir/${selectedDataId}/catatan-${endpoint}`);
			const result = await response.json();
			Swal.close();
			if (response.ok) {
				await Swal.fire({
					icon: "success",
					title: "Berhasil!",
					text: result.message || "Data berhasil diperbarui.",
				});
				if (endpoint === "afektif") {
					setSelectedAfektifDetail(result.data || payload);
				} else if (endpoint === "kognitif") {
					setSelectedKognitifDetail(result.data || payload);
				}
				fetchData(endpoint);
			} else {
				await Swal.fire({
					icon: "error",
					title: "Gagal Memperbarui",
					text: result.message || "Terjadi kesalahan saat memperbarui data.",
				});
			}

		} catch (error) {
			console.error("Error saat update:", error);
			await Swal.fire({
				icon: "error",
				title: "Terjadi Kesalahan",
				text: "Gagal menghubungi server. Silakan coba lagi.",
			});
		}
	};

	const closeAddAfektifModal = () => {
		setShowAddAfektifModal(false);
	};

	const openAddAfektifModal = () => {
		setShowAddAfektifModal(true);
	};

	const closeAddKognitifModal = () => {
		setShowAddKognitifModal(false);
	};

	const openAddKognitifModal = () => {
		setShowAddKognitifModal(true);
	};

	const closeOutModal = () => {
		setShowOutModal(false);
	};

	const openOutModal = (id) => {
		setSelectedDataId(id);
		setShowOutModal(true);
	};

	const handleChange = (e) => {
		const { name, value, dataset } = e.target;
		const formType = dataset.form;

		if (formType === 'afektif') {
			setFormAfektif(prev => ({
				...prev,
				[name]: value
			}));
		} else if (formType === 'kognitif') {
			setFormKognitif(prev => ({
				...prev,
				[name]: value
			}));
		}
	};

	const optionsNilai = ['A', 'B', 'C', 'D', 'E'];

	const tabs = [{
		id: "afektif",
		label: "Afektif",
		content: (
			<>
			<h1 className="text-xl font-bold flex items-center justify-between">Catatan Afektif
				<Access action="tambah">
					<button
						onClick={() => 
							{
								openAddAfektifModal();
							}
						}
						type="button"
						className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-green-800 cursor-pointer"
					>
						<i className="fas fa-plus"></i>
						<span>Tambah Data</span>
					</button>
				</Access>
			</h1>
			<div className="mt-5 space-y-6">
				{loadingData ? (
					<div className="flex justify-center items-center">
						<OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
					</div>
				) : error ? (
					<div className="col-span-3 text-center py-10">
						<p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
						<button
							onClick={() => 
								{
									fetchData("afektif");
								}
							}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
						>
							Coba Lagi
						</button>
					</div>
				) : dataList.length === 0 ? (
					<p className="text-center text-gray-500">Tidak ada data</p>
				) : dataList.map((afektif) => (
					<div key={afektif.id}>
						<div
							className="bg-white shadow-lg drop-shadow rounded-lg p-6 cursor-pointer w-full flex flex-col gap-4 relative"
							onClick={() => handleCardClick(afektif.id, "afektif")}
						>
							{/* Status Badge */}
							<span
								className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full ${!afektif.tanggal_selesai
									? "bg-green-100 text-green-700"
									: "bg-red-100 text-red-700"
									}`}
							>
								{!afektif.tanggal_selesai ? "Catatan Aktif" : "Catatan Nonaktif"}
							</span>

							{/* Header */}
							<div className="flex items-center gap-4">
								{/* Foto */}
								<img
									alt={afektif.nama || "-"}
									className="w-24 h-28 object-cover rounded-md shadow"
									src={afektif.foto_pencatat}
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = blankProfile;
									}}
								/>

								{/* Info Pencatat */}
								<div className="flex flex-col">
									<h1 className="text-lg font-bold">Pencatat</h1>
									<h5 className="text-md font-semibold">{afektif.nama_pencatat}</h5>
									<p className="text-gray-500 text-sm">Sebagai: {afektif.status}</p>
									<p className="text-gray-600 text-sm">
										Catatan dibuat {formatDate(afektif.tanggal_buat)}
										{afektif.tanggal_selesai
											? ` dan selesai ${formatDate(afektif.tanggal_selesai)}`
											: ""}
									</p>
								</div>


								{/* Tombol keluar di pojok kanan bawah */}
								{!afektif.tanggal_selesai && (
									<div className="absolute bottom-5 right-5">
										<Access action="keluar">
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													openOutModal(afektif.id);
												}}
												className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1 text-sm cursor-pointer"
												title="Keluar Afektif"
											>
												<FontAwesomeIcon icon={faRightFromBracket} /> Selesai
											</button>
										</Access>
									</div>
								)}	
							</div>
							<div className="text-xs text-gray-400 italic ">
								📌 Klik kartu ini untuk melihat detail nilai
							</div>
						</div>

						{loadingDetailData === afektif.id ? (
							<div className="flex justify-center items-center mt-4">
								<OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
							</div>
						) : selectedDataId === afektif.id && selectedAfektifDetail && (
							<form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-md rounded-lg p-6">
								{/* Kolom Kiri */}
								<div className="flex flex-col gap-4">
									{/* Kepedulian */}
									<div>
										<label className="block text-sm font-semibold text-gray-700">Nilai Kepedulian</label>
										<select
											name="kepedulian_nilai"
											data-form="afektif"
											value={formAfektif.kepedulian_nilai}
											onChange={handleChange}
											disabled={!canEdit || !!selectedAfektifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedAfektifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
										>
											<option value="">Pilih Nilai</option>
											{optionsNilai.map(n => (
												<option key={n} value={n}>{n}</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700">Tindak Lanjut Kepedulian</label>
										<textarea
											name="kepedulian_tindak_lanjut"
											data-form="afektif"
											value={formAfektif.kepedulian_tindak_lanjut}
											onChange={handleChange}
											rows={3}
											disabled={!canEdit || !!selectedAfektifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedAfektifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
											placeholder="Masukkan catatan atau tindak lanjut"
										/>
									</div>

									{/* Kebersihan */}
									<div>
										<label className="block text-sm font-semibold text-gray-700">Nilai Kebersihan</label>
										<select
											name="kebersihan_nilai"
											data-form="afektif"
											value={formAfektif.kebersihan_nilai}
											onChange={handleChange}
											disabled={!canEdit || !!selectedAfektifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedAfektifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
										>
											<option value="">Pilih Nilai</option>
											{optionsNilai.map(n => (
												<option key={n} value={n}>{n}</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700">Tindak Lanjut Kebersihan</label>
										<textarea
											name="kebersihan_tindak_lanjut"
											data-form="afektif"
											value={formAfektif.kebersihan_tindak_lanjut}
											onChange={handleChange}
											rows={3}
											disabled={!canEdit || !!selectedAfektifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedAfektifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
											placeholder="Masukkan catatan atau tindak lanjut"
										/>
									</div>
								</div>

								{/* Kolom Kanan */}
								<div className="flex flex-col gap-4">
									{/* Akhlak */}
									<div>
										<label className="block text-sm font-semibold text-gray-700">Nilai Akhlak</label>
										<select
											name="akhlak_nilai"
											data-form="afektif"
											value={formAfektif.akhlak_nilai}
											onChange={handleChange}
											disabled={!canEdit || !!selectedAfektifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedAfektifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
										>
											<option value="">Pilih Nilai</option>
											{optionsNilai.map(n => (
												<option key={n} value={n}>{n}</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700">Tindak Lanjut Akhlak</label>
										<textarea
											name="akhlak_tindak_lanjut"
											data-form="afektif"
											value={formAfektif.akhlak_tindak_lanjut}
											onChange={handleChange}
											rows={3}
											disabled={!canEdit || !!selectedAfektifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedAfektifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}											placeholder="Masukkan catatan atau tindak lanjut"
										/>
									</div>

									{/* Periode */}
									<div>
										<label className="block text-sm font-semibold text-gray-700">Tanggal Dibuat</label>
										<input
											type="date"
											value={startDate}
											onChange={(e) => setStartDate(e.target.value)}
											disabled={!canEdit || !!selectedAfektifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedAfektifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700">Tanggal Selesai</label>
										<input
											type="date"
											value={endDate || ""}
											onChange={(e) => setEndDate(e.target.value)}
											disabled
											className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 text-gray-500 cursor-not-allowed"										/>
									</div>
								</div>

								{/* Tombol Aksi */}
								<div className="md:col-span-2 flex justify-end gap-3 mt-4">
									<button
										type="button"
										className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none cursor-pointer"
										onClick={() => {
											setSelectedDataId(null);
											setSelectedAfektifDetail(null);
											setStartDate("");
											setEndDate("");
										}}
									>
										Batal
									</button>
									{!afektif.tanggal_selesai && (
										<Access action="edit">
											<button
												type="button"
												onClick={() => handleUpdate("afektif")} 
												className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-sm cursor-pointer"
											>
												Update
											</button>
										</Access>
									)}
								</div>
							</form>
						)}


					</div>
				))}
			</div>
			</>
		)
	}, {
		id: "kognitif",
		label: "Kognitif",
		content: (
			<>
			<h1 className="text-xl font-bold flex items-center justify-between">Catatan Kognitif
				<Access action="tambah">
					<button
						onClick={() => {
							openAddKognitifModal();
						}
						}
						type="button"
						className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-green-800 cursor-pointer"
					>
						<i className="fas fa-plus"></i>
						<span>Tambah Data</span>
					</button>
				</Access>
			</h1>
			<div className="mt-5 space-y-6">
				{loadingData ? (
					<div className="flex justify-center items-center">
						<OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
					</div>
				) : error ? (
					<div className="col-span-3 text-center py-10">
						<p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
						<button
							onClick={() => 
								{
									fetchData("kognitif");
								}
							}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
						>
							Coba Lagi
						</button>
					</div>
				) : dataList.length === 0 ? (
					<p className="text-center text-gray-500">Tidak ada data</p>
				) : dataList.map((kognitif) => (
					<div key={kognitif.id}>
						<div
							className="bg-white shadow-lg drop-shadow rounded-lg p-6 cursor-pointer w-full flex flex-col gap-4 relative"
							onClick={() => handleCardClick(kognitif.id, "kognitif")}
						>
							{/* Status Badge */}
							<span
								className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full ${!kognitif.tanggal_selesai
									? "bg-green-100 text-green-700"
									: "bg-red-100 text-red-700"
									}`}
							>
								{!kognitif.tanggal_selesai ? "Catatan Aktif" : "Catatan Nonaktif"}
							</span>

							{/* Header */}
							<div className="flex items-center gap-4">
								{/* Foto */}
								<img
									alt={kognitif.nama || "-"}
									className="w-24 h-28 object-cover rounded-md shadow"
									src={kognitif.foto_pencatat}
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = blankProfile;
									}}
								/>

								{/* Info Pencatat */}
								<div className="flex flex-col">
									<h1 className="text-lg font-bold">Pencatat</h1>
									<h5 className="text-md font-semibold">{kognitif.nama_pencatat}</h5>
									<p className="text-gray-500 text-sm">Sebagai: {kognitif.status}</p>
									<p className="text-gray-600 text-sm">
										Catatan dibuat {formatDate(kognitif.tanggal_buat)}
										{kognitif.tanggal_selesai
											? ` dan selesai ${formatDate(kognitif.tanggal_selesai)}`
											: ""}
									</p>
								</div>


								{/* Tombol keluar di pojok kanan bawah */}
								{!kognitif.tanggal_selesai && (
									<div className="absolute bottom-5 right-5">
										<Access action="keluar">
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													openOutModal(kognitif.id);
												}}
												className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1 text-sm cursor-pointer"
												title="Keluar Kognitif"
											>
												<FontAwesomeIcon icon={faRightFromBracket} /> Selesai
											</button>
										</Access>
									</div>
								)}	
							</div>
							<div className="text-xs text-gray-400 italic ">
								📌 Klik kartu ini untuk melihat detail nilai
							</div>
						</div>

						{loadingDetailData === kognitif.id ? (
							<div className="flex justify-center items-center mt-4 bg-white shadow-md rounded-lg p-6">
								<OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
							</div>
						) : selectedDataId === kognitif.id && selectedKognitifDetail && (
							<form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-md rounded-lg p-6">
								{/* Kolom Kiri */}
								<div className="flex flex-col gap-4">
									{/* Kepedulian */}
									<div>
										<label className="block text-sm font-semibold text-gray-700">Nilai Kebahasaan</label>
										<select
											name="kebahasaan_nilai"
											data-form="kognitif"
											value={formKognitif.kebahasaan_nilai}
											onChange={handleChange}
											disabled={!canEdit || !!selectedKognitifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKognitifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
										>
											<option value="">Pilih Nilai</option>
											{optionsNilai.map(n => (
												<option key={n} value={n}>{n}</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700">Tindak Lanjut Kebahasaan</label>
										<textarea
											name="kebahasaan_tindak_lanjut"
											data-form="kognitif"
											value={formKognitif.kebahasaan_tindak_lanjut}
											onChange={handleChange}
											rows={3}
											disabled={!canEdit || !!selectedKognitifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKognitifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
											placeholder="Masukkan catatan atau tindak lanjut"
										/>
									</div>

									{/* Kebersihan */}
									<div>
										<label className="block text-sm font-semibold text-gray-700">Nilai Hafalan Tahfidz</label>
										<select
											name="hafalan_tahfidz_nilai"
											data-form="kognitif"
											value={formKognitif.hafalan_tahfidz_nilai}
											onChange={handleChange}
											disabled={!canEdit || !!selectedKognitifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKognitifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
										>
											<option value="">Pilih Nilai</option>
											{optionsNilai.map(n => (
												<option key={n} value={n}>{n}</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700">Tindak Lanjut Hafalan Tahfidz</label>
										<textarea
											name="hafalan_tahfidz_tindak_lanjut"
											data-form="kognitif"
											value={formKognitif.hafalan_tahfidz_tindak_lanjut}
											onChange={handleChange}
											rows={3}
											disabled={!canEdit || !!selectedKognitifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKognitifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}											placeholder="Masukkan catatan atau tindak lanjut"
										/>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-700">Nilai Tulis Al-Quran</label>
										<select
											name="tulis_alquran_nilai"
											data-form="kognitif"
											value={formKognitif.tulis_alquran_nilai}
											onChange={handleChange}
											disabled={!canEdit || !!selectedKognitifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKognitifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
										>
											<option value="">Pilih Nilai</option>
											{optionsNilai.map(n => (
												<option key={n} value={n}>{n}</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700">Tindak Lanjut Tulis Al-Quran</label>
										<textarea
											name="tulis_alquran_tindak_lanjut"
											data-form="kognitif"
											value={formKognitif.tulis_alquran_tindak_lanjut}
											onChange={handleChange}
											rows={3}
											disabled={!canEdit || !!selectedKognitifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKognitifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}											placeholder="Masukkan catatan atau tindak lanjut"
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700">Tanggal Dibuat</label>
										<input
											type="date"
											value={startDate}
											onChange={(e) => setStartDate(e.target.value)}
											disabled={!canEdit || !!selectedKognitifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKognitifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700">Tanggal Selesai</label>
										<input
											type="date"
											value={endDate || ""}
											onChange={(e) => setEndDate(e.target.value)}
											disabled
											className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 text-gray-500 cursor-not-allowed"										/>
									</div>
								</div>

								{/* Kolom Kanan */}
								<div className="flex flex-col gap-4">
									{/* Akhlak */}
									<div>
										<label className="block text-sm font-semibold text-gray-700">Nilai Baca Kitab Kuning</label>
										<select
											name="baca_kitab_kuning_nilai"
											data-form="kognitif"
											value={formKognitif.baca_kitab_kuning_nilai}
											onChange={handleChange}
											disabled={!canEdit || !!selectedKognitifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKognitifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
										>
											<option value="">Pilih Nilai</option>
											{optionsNilai.map(n => (
												<option key={n} value={n}>{n}</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700">Tindak Lanjut Baca Kitab Kuning</label>
										<textarea
											name="baca_kitab_kuning_tindak_lanjut"
											data-form="kognitif"
											value={formKognitif.baca_kitab_kuning_tindak_lanjut}
											onChange={handleChange}
											rows={3}
											disabled={!canEdit || !!selectedKognitifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKognitifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
											placeholder="Masukkan catatan atau tindak lanjut"
										/>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-700">Nilai Furudul Ainiyah</label>
										<select
											name="furudul_ainiyah_nilai"
											data-form="kognitif"
											value={formKognitif.furudul_ainiyah_nilai}
											onChange={handleChange}
											disabled={!canEdit || !!selectedKognitifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKognitifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
										>
											<option value="">Pilih Nilai</option>
											{optionsNilai.map(n => (
												<option key={n} value={n}>{n}</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700">Tindak Lanjut Furudul Ainiyah</label>
										<textarea
											name="furudul_ainiyah_tindak_lanjut"
											data-form="kognitif"
											value={formKognitif.furudul_ainiyah_tindak_lanjut}
											onChange={handleChange}
											rows={3}
											disabled={!canEdit || !!selectedKognitifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKognitifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
											placeholder="Masukkan catatan atau tindak lanjut"
										/>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-700">Nilai Baca Al-Quran</label>
										<select
											name="baca_alquran_nilai"
											data-form="kognitif"
											value={formKognitif.baca_alquran_nilai}
											onChange={handleChange}
											disabled={!canEdit || !!selectedKognitifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKognitifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
										>
											<option value="">Pilih Nilai</option>
											{optionsNilai.map(n => (
												<option key={n} value={n}>{n}</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700">Tindak Lanjut Baca Al-Quran</label>
										<textarea
											name="baca_alquran_tindak_lanjut"
											data-form="kognitif"
											value={formKognitif.baca_alquran_tindak_lanjut}
											onChange={handleChange}
											rows={3}
											disabled={!canEdit || !!selectedKognitifDetail.tanggal_selesai}
											className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKognitifDetail.tanggal_selesai ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
											placeholder="Masukkan catatan atau tindak lanjut"
										/>
									</div>
								</div>

								{/* Tombol Aksi */}
								<div className="md:col-span-2 flex justify-end gap-3 mt-4">
									<button
										type="button"
										className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none cursor-pointer"
										onClick={() => {
											setSelectedDataId(null);
											setSelectedKognitifDetail(null);
											setStartDate("");
											setEndDate("");
										}}
									>
										Batal
									</button>
									{!kognitif.tanggal_selesai && (
										<Access action="edit">
											<button
												type="button"
												onClick={() => 
													{
														console.log("klik");
														
														handleUpdate("kognitif")
													}
												} // Fungsi untuk update data ke API
												className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-sm cursor-pointer"
											>
												Update
											</button>
										</Access>
									)}
								</div>
							</form>
						)}


					</div>
				))}
			</div>
			</>
		)
	}

	].filter(Boolean);

	return (
		<div className="block" id="Catatan">			
			<ModalAddProgressAfektifFormulir biodataId={biodata_id} isOpen={showAddAfektifModal} onClose={closeAddAfektifModal} refetchData={fetchData} />

			<ModalAddProgressKognitifFormulir biodataId={biodata_id} isOpen={showAddKognitifModal} onClose={closeAddKognitifModal} refetchData={fetchData} />

			<ModalKeluarProgressFormulir isOpen={showOutModal} onClose={closeOutModal} id={selectedDataId} refetchData={fetchData} endpoint={activeTab}/>
			
			{tabs.length > 0 && (
				<>
					<ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-500 mt-4">
						{tabs.map((tab) => (
							<li key={tab.id}>
								<button
									onClick={() => setActiveTab(tab.id)}
									className={`cursor-pointer inline-block p-3 rounded-t-lg border-b-2 ${activeTab === tab.id
										? "text-blue-600 border-blue-600 bg-gray-200"
										: "border-transparent hover:text-gray-600 hover:bg-gray-50"
										}`}
								>
									{tab.label}
								</button>
							</li>
						))}
					</ul>

					<div className="pt-4">
						{tabs.find((tab) => tab.id === activeTab)?.content}
					</div>
				</>
			)}
		</div>
	);
};

// Format tanggal ke ID
const formatDate = (dateStr) => {
	const options = { year: "numeric", month: "short", day: "2-digit" };
	return new Date(dateStr).toLocaleDateString("id-ID", options);
};

// Kapitalisasi huruf pertama
// const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default TabProgress;
