import request from '@/utils/request'

export const reqSkuList = (page, limit) => request({ method: 'GET', url: `/admin/product/list/${page}/${limit}` })

// 上架
export const reqOnSale = skuId => request({method: 'GET', url: `/admin/product/onSale/${skuId}`})
// 下架
export const reqCancelSale = skuId => request({ method: 'GET', url: `/admin/product/cancelSale/${skuId}` })

// 获取sku详细信息
export const reqSkuInfo = skuId => request({ method: 'GET', url: `/admin/product/getSkuById/${skuId}` })