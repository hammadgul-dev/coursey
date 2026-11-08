export let uploadFile = async (url: string, file: File) => {
  let form = new FormData()
  form.append("file", file)
  let res: any = await fetch(url, {method: "POST", body: form}).catch(
    () => null,
  )
  if (!res) return {ok: false, data: null, error: "Something Went Wrong"}
  let data: any = await res.json().catch(() => null)
  return {
    ok: !!res.ok,
    data,
    error: data?.error || "Something Went Wrong",
  }
}
