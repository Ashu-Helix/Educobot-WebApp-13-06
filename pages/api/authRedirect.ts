import type { NextApiRequest, NextApiResponse } from 'next'
import jwtDecode from 'jwt-decode';

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI0ZTljNmQzNC0zMzZiLTRiNzQtOTkwYy1lOWUwOWVkNzI4YmEiLCJpYXQiOjE2NTIzMzg5MTF9.d6_VcExvCKcwrl1dXSc7PBrZMAv0lukGvJPD3uVJY-4";
    if (!accessToken) {
        return false;
    }
    const decoded = jwtDecode<{ exp: number }>(accessToken);
    const currentTime = Date.now() / 1000;
    const { slugType, lesson_id, userId } = req.query
    if (decoded.exp > currentTime)
        res.redirect(`http://localhost:3000/${slugType}/${lesson_id}`)
    res.send(`http://localhost:3000/${slugType}/${lesson_id}`)
}