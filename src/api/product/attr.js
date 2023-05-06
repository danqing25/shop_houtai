// 平台属性管理模块

import request from '@/utils/request'

export const reqCategoryList1 = () => request({ method: 'GET', url: `/admin/product/getCategory1` })
export const reqCategoryList2 = category1Id => request({ method: 'GET', url: `/admin/product/getCategory2/${category1Id}` })
export const reqCategoryList3 = category2Id => request({ method: 'GET', url: `/admin/product/getCategory3/${category2Id}` })

// 获取相应分类下的全部平台属性
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ method: 'GET', url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}` })

//添加/修改属性值
export const reqAddOrUpdateAttr = (attrInfo) => request({ method: 'POST', url: '/admin/product/saveAttrInfo', data: attrInfo })

// 删除属性
export const reqDeleteAttr = (attrId) => request({url: `/admin/product/deleteAttr/${attrId}`, method: 'DELETE'})