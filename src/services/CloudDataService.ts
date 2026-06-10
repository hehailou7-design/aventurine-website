/**
 * 全球数据同步服务
 * 使用 JSONBin.io 作为云端存储，让所有用户看到相同的数据
 */

const BIN_ID = '68292066acd3cb34af8e3a4f' // 您需要在 jsonbin.io 创建 bin 并替换此 ID
const API_KEY = '$2a$10$YourAPIKeyHere' // 可选：如果需要私有 bin

const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`
const HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'X-Master-Key': API_KEY,
}

export interface CloudData {
  blessings: any[]
  blackMudPosts: any[]
  blackMudUsers: any[]
  pendingSubmits: any[]
  approvedSubmits: any[]
  rejectedSubmits: any[]
  offlineFeedback: any[]
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
  lastUpdated: new Date().toISOString(),
}

/**
 * 从云端读取数据
 */
export async function fetchCloudData(): Promise<CloudData> {
  try {
    const response = await fetch(`${BIN_URL}/latest`, {
      method: 'GET',
      headers: HEADERS,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    return result.record || DEFAULT_DATA
  } catch (error) {
    console.error('Failed to fetch cloud data:', error)
    return DEFAULT_DATA
  }
}

/**
 * 保存数据到云端
 */
export async function saveCloudData(data: CloudData): Promise<boolean> {
  try {
    data.lastUpdated = new Date().toISOString()
    
    const response = await fetch(BIN_URL, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return true
  } catch (error) {
    console.error('Failed to save cloud data:', error)
    return false
  }
}

/**
 * 初始化云端数据（第一次使用时）
 */
export async function initCloudData(): Promise<void> {
  try {
    const response = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
        'X-Bin-Name': 'aventurine-fan-site-data',
      },
      body: JSON.stringify(DEFAULT_DATA),
    })
    
    const result = await response.json()
    console.log('Cloud data initialized. Bin ID:', result.metadata.id)
    console.log('请在代码中更新 BIN_ID 为:', result.metadata.id)
  } catch (error) {
    console.error('Failed to init cloud data:', error)
  }
}

/**
 * 合并本地和云端数据（以云端为准）
 */
export function mergeData(localData: CloudData, cloudData: CloudData): CloudData {
  // 简单策略：云端数据优先
  // 可以根据 timestamp 实现更智能的合并
  return {
    ...localData,
    ...cloudData,
    lastUpdated: cloudData.lastUpdated || localData.lastUpdated,
  }
}
