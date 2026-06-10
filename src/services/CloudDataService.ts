/**
 * 全球数据同步服务
 * 使用 JSONBin.io 作为云端存储，让所有用户看到相同的数据
 * 
 * 设置说明：
 * 1. 访问 https://jsonbin.io 注册账号
 * 2. 创建新的 Bin，记录 Bin ID
 * 3. 获取 API Key (Master Key)
 * 4. 替换下面的 BIN_ID 和 API_KEY
 */

// TODO: 用户需要创建自己的 JSONBin.io Bin 并替换下面的 ID 和 Key
const BIN_ID = '68292066acd3cb34af8e3a4f' // 替换为你的 Bin ID
const API_KEY = '$2a$10$YourAPIKeyHere' // 替换为你的 API Key

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
      console.warn(`Failed to fetch cloud data: ${response.status}`)
      return DEFAULT_DATA
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
      console.warn(`Failed to save cloud data: ${response.status}`)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Failed to save cloud data:', error)
    return false
  }
}

/**
 * 初始化云端数据（第一次使用时）
 * 运行一次后，在控制台会输出 Bin ID，需要更新上面的 BIN_ID
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
    console.log('✅ Cloud data initialized!')
    console.log('Bin ID:', result.metadata.id)
    console.log('请在 CloudDataService.ts 中更新 BIN_ID 为:', result.metadata.id)
  } catch (error) {
    console.error('Failed to init cloud data:', error)
  }
}
