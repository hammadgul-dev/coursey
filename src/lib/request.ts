export async function request(url: string, method: string, body?: any) {
  try {
    let init: any = {method, headers: {"Content-Type": "application/json"}}
    if (body !== undefined) init.body = JSON.stringify(body)
    let res = await fetch(url, init)
    let data: any = await res.json().catch(() => null)
    if (!res.ok) {
      return {ok: false, data, error: data?.error || "Something Went Wrong"}
    }
    return {ok: true, data, error: ""}
  } catch (e) {
    return {ok: false, data: null, error: "Something Went Wrong"}
  }
}
