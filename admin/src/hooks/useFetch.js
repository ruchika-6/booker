import { useEffect } from "react"
import { useState } from "react"
import axios from "axios"

const useFetch = (url)=>{
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(false)

    //Whenever url changes fire this function
    useEffect(()=>{
        const fetchData = async ()=>{
            setLoading(true)
            try{
                const res = await axios.get(url);
                setData(res.data)
            }
            catch(err)
            {
                setError(error);
            }
            setLoading(false);
        };
        fetchData();
    },[url])

    const reFetch = async ()=>{
        setLoading(true)
        try{
            const res = await axios.get(url);
            setData(res.data)
        }
        catch(err)
        {
            setError(error);
        }
        setLoading(false);
    };

    return {data,loading,error,reFetch}
}

export default useFetch;