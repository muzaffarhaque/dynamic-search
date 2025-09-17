import axios from 'axios';

const commonGetApi = async (url) => {
    try {
        const res = await axios.get(url);
        return res;
    } catch (error) {
        return false;
    }
};

export default commonGetApi;
