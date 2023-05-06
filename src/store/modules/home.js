import mockRequest from '@/utils/mockRequest'

export default {
    namespaced: true,
    state: {
        dataObj: {}
    },
    actions: {
        async getData(context) {
            const result = await mockRequest.get('/home/list')
            if (result.code == 20000) {
                context.commit('GET_DATA', result.data)
            }
        }
    },
    mutations: {
        GET_DATA(state, data) {
            state.dataObj =data
        }
    }
}