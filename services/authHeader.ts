export default function authHeader(): { Authorization: string } {
    const token = localStorage.getItem("reserve_token");

    return { Authorization: `Bearer ${token as string}` };
}
