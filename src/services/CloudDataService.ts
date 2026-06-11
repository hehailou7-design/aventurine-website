/**
 * 全球数据同步服务
 * 使用 JSONBin.io 作为云端存储，让所有用户看到相同的数据
 * 
 * 配置说明：
 * 1. 访问 https://jsonbin.io 注册账号
 * 2. 创建新的 Bin，记录 Bin ID
 * 3. 获取 API Key (Master Key)
 * 4. 在管理后台（⚙ → 设置 Token）填写 Bin ID 和 API Key
 * 5. 发布到全站后，所有用户自动使用该配置
 * 
 * 配置优先级：
 * 1. localStorage（管理员本地的 aventurine_cloud_config）
 * 2. content.json 中的 siteConfig.jsonBinApiKey / siteConfig.jsonBinBinId
 * 3. 硬编码默认值（兜底）
 */

// 默认值（兜底）
// ⚠️ 注意：此 Key 为 Master Key，具有完全权限，请勿泄露
const DEFAULT_BIN_ID = '6a2a0526f5f4af5e29dbdee6'
const DEFAULT_API_KEY = '$2a$10$4A22bLlkifzYfvNvyoEQeOcJicGmFUFzrG1e.0IhHvaSlIP2yIh2i'

/** 获取当前生效的 Bin ID */
function getBinId(): string {
  // 1. 本地直接配置优先
  try {
    const local = localStorage.getItem('aventurine_cloud_config')
    if (local) {
      const cfg = JSON.parse(local)
      if (cfg.jsonBinBinId) return cfg.jsonBinBinId
    }
  } catch {}
  // 2. content.json 中的 siteConfig
  try {
    const published = localStorage.getItem('aventurine_published_content')
    if (published) {
      const data = JSON.parse(published)
      if (data?.siteConfig?.jsonBinBinId) return data.siteConfig.jsonBinBinId
    }
  } catch {}
  // 3. localStorage diff 中的 siteConfig
  try {
    const diff = localStorage.getItem('aventurine_site_content')
    if (diff) {
      const data = JSON.parse(diff)
      if (data?.siteConfig?.jsonBinBinId) return data.siteConfig.jsonBinBinId
    }
  } catch {}
  return DEFAULT_BIN_ID
}

/** 获取当前生效的 API Key */
function getApiKey(): string {
  // 1. 本地直接配置优先
  try {
    const local = localStorage.getItem('aventurine_cloud_config')
    if (local) {
      const cfg = JSON.parse(local)
      if (cfg.jsonBinApiKey) return cfg.jsonBinApiKey
    }
  } catch {}
  // 2. content.json 中的 siteConfig
  try {
    const published = localStorage.getItem('aventurine_published_content')
    if (published) {
      const data = JSON.parse(published)
      if (data?.siteConfig?.jsonBinApiKey) return data.siteConfig.jsonBinApiKey
    }
  } catch {}
  // 3. localStorage diff 中的 siteConfig
  try {
    const diff = localStorage.getItem('aventurine_site_content')
    if (diff) {
      const data = JSON.parse(diff)
      if (data?.siteConfig?.jsonBinApiKey) return data.siteConfig.jsonBinApiKey
    }
  } catch {}
  return DEFAULT_API_KEY
}

/** 设置云端配置（管理员在后台配置时调用） */
export function setCloudConfig(binId: string, apiKey: string): void {
  try {
    localStorage.setItem('aventurine_cloud_config', JSON.stringify({
      jsonBinBinId: binId,
      jsonBinApiKey: apiKey,
    }))
  } catch {}
}

/** 获取当前云端配置 */
export function getCloudConfig(): { binId: string; apiKey: string } {
  return { binId: getBinId(), apiKey: getApiKey() }
}

/** 检查是否已正确配置（Key 是否为有效的 bcrypt 格式） */
export function isCloudConfigured(): boolean {
  const key = getApiKey()
  return key.startsWith('$2a$') && key.length > 50
}

function getBinUrl() {
  return `https://api.jsonbin.io/v3/b/${getBinId()}`
}

function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Master-Key': getApiKey(),
  }
}

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

/**
 * 从云端读取数据
 */
export async function fetchCloudData(): Promise<CloudData> {
  try {
    const response = await fetch(`${getBinUrl()}/latest`, {
      method: 'GET',
      headers: getHeaders(),
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
    
    const response = await fetch(getBinUrl(), {
      method: 'PUT',
      headers: getHeaders(),
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
        'X-Master-Key': getApiKey(),
        'X-Bin-Name': 'aventurine-fan-site-data',
      },
      body: JSON.stringify(DEFAULT_DATA),
    })
    
    const result = await response.json()
    console.log('✅ Cloud data initialized!')
    console.log('Bin ID:', result.metadata.id)
    console.log('请在管理后台中设置 Bin ID 为:', result.metadata.id)
  } catch (error) {
    console.error('Failed to init cloud data:', error)
  }
}
