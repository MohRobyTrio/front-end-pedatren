// const TabPengurus = () => {
//     return (
//         <h1 className="text-xl font-bold">Pengurus</h1>
//     )
// };

// export default TabPengurus;

const TabPengurus = () => {
    const data = [
      {
        title: "Kepala Bagian PEPHA, Ortala dan Kepegawaian",
        period: "Sejak 7 Jan 2018 Sampai 26 Jul 2021"
      },
      {
        title: "Kepala Inkubasi Bisnis Pesantren",
        period: "Sejak 26 Jun 2021 Sampai 31 Des 2022"
      },
      {
        title: "Sekretaris Pesantren",
        details: "Tetap | Grade B2",
        period: "Sejak 1 Jan 2023 Sampai Sekarang"
      }
    ];
  
    return (
      <>
        <h1 className="text-xl font-bold">Pengurus</h1>
        <hr className="border-t border-gray-300 my-4" />
        {data.map((item, index) => (
          <div key={index} className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
            {item.details && <p className="text-gray-600 text-sm">{item.details}</p>}
            <p className="text-gray-600 text-sm">{item.period}</p>
          </div>
        ))}
      </>
    );
  };
  
  export default TabPengurus;
  