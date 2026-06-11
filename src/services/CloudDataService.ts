/**
 * 全球数据同步服务
 * 使用 jsonblob.com 作为云端存储，让所有用户看到相同的数据
 * 
 * 特点：
 * - 无需 API Key，无需注册账号
 * - 原生 CORS 支持，浏览器直接请求
 * - 简单 REST API (GET/PUT)
 * 
 * Blob URL: https://jsonblob.com/api/jsonBlob/019eb45f-fbbc-7ef7-af71-2ae7db1ff938
 */

const BLOB_ID = '019eb45f-fbbc-7ef7-af71-2ae7db1ff938'
const BLOB_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`

export interface CloudData {
  blessings: any[]
  blackMudPosts: any[]
  blackMudUsers: any[]
  pendingSubmits: any[]
  approvedSubmits: any[]
  rejectedSubmits: any[]
  offlineFeedback: any[]
  feedbacks: any[]           // 意见反馈
  sponsorshipApps: any[]     // 生贺组应聘/赞助申请
  knowledgePending: any[]    // 砂砂想说冷知识投稿
  materialComments: Record<string, any[]> // 角色物料评论
  lastUpdated: string
}

const DEFAULT_DATA: CloudData = {
  blessings: [],
  blackMudPosts: [],
  blackMudUsers: [],
  pendingSubmits: [],
  approvedSubmits: [],
  rejectedSubmits: [],
  offlineFeedback: [],
  feedbacks: [],
  sponsorshipApps: [],
  knowledgePending: [],
  materialComments: {},
  lastUpdated: new Date().toISOString(),
}

/**
 * 从云端读取数据
 */
export async function fetchCloudData(): Promise<CloudData> {
  try {
    console.log('☁️ [CloudData] GET 请求:', BLOB_URL)
    const response = await fetch(BLOB_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    })
    
    console.log('☁️ [CloudData] GET 响应状态:', response.status)
    
    if (!response.ok) {
      console.warn(`⚠️ [CloudData] 读取失败: ${response.status}`)
      return DEFAULT_DATA
    }
    
    const data = await response.json()
    console.log('☁️ [CloudData] 读取成功, blessings:', data.blessings?.length || 0, '条')
    return data || DEFAULT_DATA
  } catch (error) {
    console.error('❌ [CloudData] 读取异常:', error)
    return DEFAULT_DATA
  }
}

/**
 * 保存数据到云端（完整替换）
 */
export async function saveCloudData(data: CloudData): Promise<boolean> {
  try {
    data.lastUpdated = new Date().toISOString()
    
    const body = JSON.stringify(data)
    console.log('☁️ [CloudData] PUT 请求, 数据大小:', body.length, 'bytes, blessings:', data.blessings?.length, '条')
    
    const response = await fetch(BLOB_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body,
    })
    
    console.log('☁️ [CloudData] PUT 响应状态:', response.status)
    
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      console.warn('❌ [CloudData] 保存失败:', response.status, text.substring(0, 200))
      return false
    }
    
    console.log('✅ [CloudData] 保存成功!')
    return true
  } catch (error) {
    console.error('❌ [CloudData] 保存异常:', error)
    return false
  }
}

/** 合并函数：云端数据优先（保留未冲突的本地数据） */
export function mergeById(cloud: any[], local: any[]): any[] {
  const map = new Map<string, any>()
  cloud.forEach(item => map.set(item.id, item))
  local.forEach(item => { if (!map.has(item.id)) map.set(item.id, item) })
  return Array.from(map.values())
}

/** 合并对象数组，云端覆盖本地同 id */
export function mergeArrays(cloud: any[], local: any[]): any[] {
  if (!cloud || cloud.length === 0) return local
  if (!local || local.length === 0) return cloud
  return mergeById(cloud, local)
}

/** 合并 object 类型（如 materialComments） */
export function mergeObjects<T extends Record<string, any>>(cloud: T, local: T): T {
  const result: any = { ...local }
  for (const key of Object.keys(cloud)) {
    result[key] = (cloud as any)[key] || result[key] || []
  }
  return result as T
}

// ===== 兼容旧 API（向后兼容，这些函数是之前 JSONBin 时代留下的，保留避免编译报错）=====

/** @deprecated jsonblob 不需要 API Key，保留此函数仅为向后兼容 */
export function setCloudConfig(_binId: string, _apiKey: string): void {
  // no-op，jsonblob 不需要配置
}

/** @deprecated jsonblob 不需要配置，始终返回已配置 */
export function getCloudConfig(): { binId: string; apiKey: string } {
  return { binId: BLOB_ID, apiKey: '(jsonblob无需API Key)' }
}

/** @deprecated jsonblob 不需要配置，始终返回 true */
export function isCloudConfigured(): boolean {
  return true // jsonblob 总是可用的
}

/** @deprecated jsonblob 不需要初始化 */
export async function initCloudData(): Promise<void> {
  // no-op
}
