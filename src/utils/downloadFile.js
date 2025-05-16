export async function downloadFile(url, setLoading) {
  try {
    setLoading(true);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Gagal download: ${response.statusText}`);
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Terjadi kesalahan saat download:', error);
    alert('Download gagal. Silakan coba lagi.');
  } finally {
    setLoading(false);
  }
}
