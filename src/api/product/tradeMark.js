// 获取品牌管理列表数据

import request from '@/utils/request'

export const requestTradeMark = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, methods: 'GET' })

export const reqAddOrUpdateTradeMark = formData => {
    if (formData.id) {
        return request({method: 'PUT', url: '/admin/product/baseTrademark/update', data: formData})
    } else {
        return request({method: 'POST', url: '/admin/product/baseTrademark/save', data: formData})
    }
} 

export const reqDeleteTrademark = id => request({method: 'DELETE', url: `/admin/product/baseTrademark/remove/${id}`})