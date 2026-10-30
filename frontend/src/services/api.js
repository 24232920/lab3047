const apiRequest = async function (url, method = "GET", data) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message);
        }

        return json;
    } catch (err) {
        console.error("API request error:", err);
        throw err;
    }
}

export { apiRequest };