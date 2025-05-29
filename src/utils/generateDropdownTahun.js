export function generateDropdownTahun({
	startYear = 1940,
	placeholder = "Pilih Tahun",
	labelTemplate = "Tahun {year}",
} = {}) {
	const currentYear = new Date().getFullYear();
	const endYear = currentYear;

	const tahunDropdown = [
		{ label: placeholder, value: "" },
		...Array.from({ length: endYear - startYear + 1 }, (_, i) => {
		const year = endYear - i;
		return {
			label: labelTemplate.replace("{year}", year),
			value: year,
		};
		}),
	];

  	return tahunDropdown;
}
