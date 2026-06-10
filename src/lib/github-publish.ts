/**
 * Prepares site content for publishing by stripping non-serializable parts
 * and returning a formatted JSON string ready for download.
 */
export function preparePublishContent(content: Record<string, unknown>): string {
  const clean = JSON.parse(JSON.stringify(content))
  return JSON.stringify(clean, null, 2)
}

/**
 * Triggers a browser download of the content JSON file.
 */
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

// GitHub token 存储 key — 用户需在 CMS 设置中配置
const GH_TOKEN_KEY = 'aventurine_gh_token'

function getToken(): string {
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
  return getToken()
}

interface PublishResult {
  success: boolean
  message: string
  commitUrl?: string
}

/**
 * 一键发布：将 content.json 推送至 GitHub 仓库
 * GitHub Actions 会自动检测推送 → 构建 → 部署到 aventurine0505.xyz
 */
export async function publishToGitHub(jsonStr: string): Promise<PublishResult> {
  const token = getToken()
  if (!token) {
    return { success: false, message: '未配置 GitHub Token，请在 CMS 设置中输入' }
  }

  const apiBase = `https://api.github.com/repos/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}`
  const fileUrl = `${apiBase}/contents/${GITHUB_REPO.filePath}`

  try {
    // 步骤1：获取当前文件的 SHA（GitHub API 更新文件需要）
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
    // 如果文件不存在（404），sha 为空字符串，GitHub API 会创建新文件

    // 步骤2：Base64 编码内容
    const base64Content = btoa(unescape(encodeURIComponent(jsonStr)))

    // 步骤3：PUT 推送
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
