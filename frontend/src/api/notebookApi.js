import axios from "axios";

const api = axios.create({
  baseURL: "https://notebook-app-ude2.onrender.com/api/notebook",
});

export const addEntry      = (heading, data)             => api.post("/add", { heading, data });
export const getAllData     = ()                          => api.get("/");
export const getByHeading  = (heading)                   => api.get(`/${encodeURIComponent(heading)}`);
export const updateEntry   = (heading, oldData, newData) => api.put(`/update/${encodeURIComponent(heading)}`, { oldData, newData });
export const deleteEntry   = (heading, data)             => api.delete(`/delete/${encodeURIComponent(heading)}`, { data: { data } });
export const deleteHeading = (heading)                   => api.delete(`/delete/${encodeURIComponent(heading)}`);