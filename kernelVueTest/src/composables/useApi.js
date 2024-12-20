import { useAsyncState } from '@vueuse/core'
import axios from 'axios'
import { useToken } from './useToken';

export const useApi = (params = {}) => {
    const token = useToken();

    return useAsyncState((args = {}) => {
        return axios({
            ...params,
            ...args,
            headers: {'X-Token': token.value}
        })
        .then(t => t.data)
    },
    undefined,
    {immediate: false});
};