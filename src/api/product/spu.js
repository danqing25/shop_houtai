import request from '@/utils/request'

export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: "GET", params: { category3Id } })

// 获取spu信息
export const reqSpuInfo = (spuId) => request({ method: 'GET', url: `/admin/product/getSpuById/${spuId}` })
// 获取品牌数据
export const reqTrademark = () => request({ method: 'GET', url: '/admin/product/baseTrademark/getTrademarkList' })
// 获取spu图片
export const reqSpuImage = (spuId) => request({ method: 'GET', url: `/admin/product/spuImageList/${spuId}` })
// 获取销售属性--整个平台固定只有3个
export const reqSaleAttr = () => request({ method: 'GET', url: '/admin/product/baseSaleAttrList' })

// 添加/修改SPU
export const reqAddOrUpdate = (spuInfo) => {
    if (spuInfo.id) {  // 修改
        return request({ method: 'POST', url: '/admin/product/updateSpuInfo', data: spuInfo })
    } else {  // 添加
        return request({ method: 'POST', url: '/admin/product/saveSpuInfo', data: spuInfo })
    }
}
// 删除SPU
export const reqDeleteSpu = (spuId) => request({ method: 'DELETE', url: `/admin/product/deleteSpu/${spuId}` })


// 获取该spu的销售属性
export const reqSpuSaleAttr = (spuId) => request({ method: 'GET', url: `/admin/product/spuSaleAttrList/${spuId}` })

// 保存skuForm数据
export const saveSkuForm = skuFormData => request({ method: 'POST', url: '/admin/product/saveSkuInfo', data: skuFormData })

// 获取该spu的sku列表
export const reqSpuSkuList = spuId => request({ method: 'GET', url: `/admin/product/findBySpuId/${spuId}` })
