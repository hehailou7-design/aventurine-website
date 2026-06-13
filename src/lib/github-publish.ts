/**
 * GitHub 发布相关工具函数
 */

export function preparePublishContent(content: Record<string, unknown>): string {
  const clean = JSON.parse(JSON.stringify(content))
  return JSON.stringify(clean, null, 2)
}

export function downloadContentJson(jsonStr: string): void {
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'content.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ============ GitHub API 一键发布 ============

const GITHUB_REPO = {
  owner: 'hehailou7-design',
  repo: 'aventurine-website',
  branch: 'main',
  filePath: 'public/data/content.json',
}

// GitHub token 本地存储 key
const GH_TOKEN_KEY = 'aventurine_gh_token'

function getTokenFromStorage(): string {
  return localStorage.getItem(GH_TOKEN_KEY) || ''
}

export function setGitHubToken(token: string) {
  if (token) {
    localStorage.setItem(GH_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(GH_TOKEN_KEY)
  }
}

export function getGitHubToken(): string {
  return getTokenFromStorage()
}

// ============ Token 同步（Base64 编码存储到 content.json） ============

/**
 * 将 token 编码后存到 content._sync.ghToken
 * 注意：Base64 不是加密，content.json 是公开文件，任何人都可读取。
 */
export function encodeTokenForSync(token: string): string {
  if (!token) return ''
  return btoa(unescape(encodeURIComponent(token)))
}

export function decodeTokenFromSync(encoded: string): string {
  if (!encoded) return ''
  try {
    return decodeURIComponent(escape(atob(encoded)))
  } catch {
    return ''
  }
}

/**
 * 获取 token：优先本地 storage，其次 content._sync.ghToken
 */
export function getGitHubTokenWithSync(content: Record<string, unknown>): string {
  const local = getTokenFromStorage()
  if (local) return local
  const encoded = (content as any)?._sync?.ghToken || ''
  return decodeTokenFromSync(encoded)
}

// ============ GitHub API 发布 ============

interface PublishResult {
  success: boolean
  message: string
  commitUrl?: string
}

export async function publishToGitHub(jsonStr: string, tokenOverride?: string): Promise<PublishResult> {
  const token = tokenOverride || getTokenFromStorage()
  if (!token) {
    return { success: false, message: '未配置 GitHub Token，请在 CMS 设置中输入' }
  }

  const apiBase = `https://api.github.com/repos/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}`
  const fileUrl = `${apiBase}/contents/${GITHUB_REPO.filePath}`

  try {
    const getRes = await fetch(`${fileUrl}?ref=${GITHUB_REPO.branch}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    let sha = ''
    if (getRes.ok) {
      const data = await getRes.json()
      sha = data.sha
    }

    const base64Content = btoa(unescape(encodeURIComponent(jsonStr)))

    const putBody: Record<string, string> = {
      message: 'CMS: 发布内容更新',
      content: base64Content,
      branch: GITHUB_REPO.branch,
    }
    if (sha) {
      putBody.sha = sha
    }

    const putRes = await fetch(fileUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(putBody),
    })

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}))
      const errMsg = (errData as any).message || `HTTP ${putRes.status}`
      return { success: false, message: `发布失败：${errMsg}` }
    }

    const result = await putRes.json()
    const commitUrl = (result as any).commit?.html_url || ''
    const shaShort = ((result as any).content?.sha || '').substring(0, 7)

    return {
      success: true,
      message: `发布成功！已推送至 GitHub（${shaShort}）\nGitHub Actions 正在自动部署，约 2 分钟后生效`,
      commitUrl,
    }
  } catch (err: any) {
    return {
      success: false,
      message: `发布失败：${err.message || '网络错误，请检查是否能访问 GitHub'}`,
    }
  }
}
