export async function apiPost(path, body, token = null) {
    const res = await fetch(`/api/${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(body),
    });
    return res;
}

export async function apiGet(path, token = null, queryParams = {}) {
    const query = new URLSearchParams(queryParams).toString();
    const url = `/api/${path}${query ? `?${query}` : ""}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });
    return res;
}

export async function apiPut(path, formData, token = null) {
    const res = await fetch(`/api/${path}`, {
        method: "PUT",
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            
        },
        body: formData,
    });
    return res;
}