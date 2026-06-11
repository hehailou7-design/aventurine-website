/**
 * 全球数据同步服务
 * 使用 JSONBin.io 公开 Bin 作为云端存储
 * 
 * 特点：
 * - 公开 Bin 无需认证（X-Bin-Private: false）
 * - 完整 CORS 支持（Access-Control-Allow-Origin: *）
 * - 浏览器直接读写，无 401 问题
 * 
 * Bin ID: 6a2a1fccf5f4af5e29dc4391
 * Bin URL: https://api.jsonbin.io/v3/b/6a2a1fccf5f4af5e29dc4391
 */

const BIN_ID = '6a2a1fccf5f4af5e29dc4391'
const BIN_BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`

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
 * 从云端读取数据（公开 Bin，无需认证）
 */
export async function fetchCloudData(): Promise<CloudData> {
  try {
    const url = `${BIN_BASE_URL}/latest`
    console.log('☁️ [CloudData] GET:', url)
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'X-Bin-Meta': 'false' },
    })
    
    console.log('☁️ [CloudData] GET 状态:', response.status)
    
    if (!response.ok) {
      console.warn(`⚠️ [CloudData] 读取失败: ${response.status}`)
      return DEFAULT_DATA
    }
    
    const data = await response.json()
    // JSONBin 返回格式：{ record: {...}, metadata: {...} }
    const record = data.record || data
    console.log('☁️ [CloudData] 读取成功, blessings:', record.blessings?.length || 0, '条')
    return { ...DEFAULT_DATA, ...record }
  } catch (error) {
    console.error('❌ [CloudData] 读取异常:', error)
    return DEFAULT_DATA
  }
}

/**
 * 保存数据到云端（完整替换，公开 Bin 无需认证）
 */
export async function saveCloudData(data: CloudData): Promise<boolean> {
  try {
    data.lastUpdated = new Date().toISOString()
    
    const body = JSON.stringify(data)
    console.log('☁️ [CloudData] PUT 请求, blessings:', data.blessings?.length, '条')
    
    const response = await fetch(BIN_BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
    
    console.log('☁️ [CloudData] PUT 状态:', response.status)
    
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

// ===== 兼容旧 API（向后兼容）=====

/** @deprecated 保留仅为向后兼容 */
export function setCloudConfig(_binId: string, _apiKey: string): void {
  // no-op
}

/** @deprecated 保留仅为向后兼容 */
export function getCloudConfig(): { binId: string; apiKey: string } {
  return { binId: BIN_ID, apiKey: '(公开Bin，无需Key)' }
}

/** 始终返回 true */
export function isCloudConfigured(): boolean {
  return true
}

/** @deprecated 无需初始化 */
export async function initCloudData(): Promise<void> {
  // no-op
}
