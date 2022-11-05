import useAxios from "axios-hooks";

const API_URL = 'http://localhost:8000';

export default function AxiosHooks() {
    const [{ data, loading, error}, refetchRegions] = useAxios(`${API_URL}/api/regions/`)

    return refetchRegions()


}