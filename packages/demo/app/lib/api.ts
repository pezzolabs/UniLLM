export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/files", {
    method: "POST",
    body: formData,
  });

  return res;
}
