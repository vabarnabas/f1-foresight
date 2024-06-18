import { HttpClient } from "./request";

export const httpClient = new HttpClient(process.env.NEXT_PUBLIC_API_URL!);
